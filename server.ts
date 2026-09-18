import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Weekly Meal Plan Generation
app.post('/api/mealplan/generate', async (req, res) => {
  try {
    const {
      profile,
      goal = 'balanced',
      calorieTarget = 1800,
      allergies = [],
      excludeSpicy = false,
      lowSodium = false,
      additionalNotes = '',
      daysCount = 7,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. AI 맞춤 생성 기능은 API 키 설정 후 사용하실 수 있습니다.',
      });
    }

    const goalDescriptions: Record<string, string> = {
      balanced: '균형 잡힌 영양 식단 (탄수화물 50%, 단백질 25%, 지방 25% 비율)',
      diet: '체지방 감량 및 다이어트 식단 (고단백 저탄수화물, 풍부한 식이섬유)',
      muscle: '근육 성장 및 벌크업 식단 (매 끼니 35g+ 고품질 단백질, 복합 탄수화물)',
      bloodsugar: '저염·저GI 혈당/혈압 관리 식단 (통곡물, 1400mg 이하 저나트륨, 채소 듬뿍)',
      quick: '바쁜 직장인을 위한 15분 초간단 식단 (원팬/밀프렙 중심)',
    };

    const profileText = profile
      ? `- 사용자 신체: ${profile.age}세 ${profile.gender === 'male' ? '남성' : '여성'}, 키 ${profile.heightCm}cm, 몸무게 ${profile.weightKg}kg
- 활동량: ${profile.activityLevel} (기초대사량 BMR: ${profile.bmr || '계산'} kcal, 일일소비량 TDEE: ${profile.tdee || '계산'} kcal)
- 영양소 목표 권장량: 탄수화물 ${profile.recommendedCarbs || Math.round((calorieTarget * 0.5) / 4)}g, 단백질 ${profile.recommendedProtein || Math.round((calorieTarget * 0.25) / 4)}g, 지방 ${profile.recommendedFat || Math.round((calorieTarget * 0.25) / 9)}g`
      : '';

    const prompt = `사용자를 위한 맞춤형 ${daysCount}일(월~${daysCount === 7 ? '일' : daysCount + '일간'}) 영양 식단표와 레시피를 생성해 주세요.

[사용자 프로필 & 조건]
${profileText}
- 목표: ${goalDescriptions[goal] || goal}
- 하루 목표 칼로리: ${calorieTarget} kcal (오차 범위 ±5%)
- 알레르기/비선호 식품: ${allergies.length > 0 ? allergies.join(', ') : '없음'}
- 매운 음식 제외 여부: ${excludeSpicy ? '매운 음식 및 캡사이신 배제' : '보통'}
- 저염식 엄격 적용: ${lowSodium ? '하루 나트륨 1300mg 이하 엄격한 저염' : '보통'}
- 추가 요청사항: ${additionalNotes || '없음'}

[요구사항]
1. 각 날짜마다 아침(breakfast), 점심(lunch), 저녁(dinner), 간식(snack) 4끼를 구성해 주세요.
2. 모든 메뉴는 한국 가정에서 쉽게 만들 수 있는 친숙하고 맛있는 한식 및 건강 퓨전 요리여야 합니다.
3. 각 요리마다 정확한 재료 목록(g/개/큰술 등 단위 포함, 카테고리 분류), 단계별 상세 조리법(초 단위 타이머 포함), 정확한 영양정보(칼로리, 단백질g, 탄수화물g, 지방g, 나트륨mg, 식이섬유g), 영양사의 조리 팁(chefTips) 2가지와 건강 효과(healthBenefit)를 명시해 주세요.
4. 하루 총 칼로리가 대략 ${calorieTarget} kcal에 근접하도록 영양 밸런스를 맞춰주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          '당신은 한국 최고 권위의 임상영양사이자 셰프입니다. 과학적인 영양 비율과 맛있는 식단을 결합하여 완벽한 주간 식단표와 요리 레시피를 JSON 형태로 응답합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            summary: { type: Type.STRING },
            targetCalories: { type: Type.NUMBER },
            macroRatio: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              },
              required: ['carbs', 'protein', 'fat'],
            },
            dietaryGuidance: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: '월, 화, 수, 목, 금, 토, 일 중 하나' },
                  dayLabel: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  meals: {
                    type: Type.OBJECT,
                    properties: {
                      breakfast: { $ref: '#/definitions/MealItem' },
                      lunch: { $ref: '#/definitions/MealItem' },
                      dinner: { $ref: '#/definitions/MealItem' },
                      snack: { $ref: '#/definitions/MealItem' },
                    },
                    required: ['breakfast', 'lunch', 'dinner'],
                  },
                  totalNutrition: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                      sodium: { type: Type.NUMBER },
                      fiber: { type: Type.NUMBER },
                    },
                    required: ['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber'],
                  },
                },
                required: ['day', 'dayLabel', 'theme', 'meals', 'totalNutrition'],
              },
            },
          },
          required: ['title', 'tagline', 'summary', 'targetCalories', 'macroRatio', 'dietaryGuidance', 'days'],
          definitions: {
            MealItem: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                subTitle: { type: Type.STRING },
                mealType: { type: Type.STRING },
                categoryTag: { type: Type.STRING },
                prepTimeMinutes: { type: Type.NUMBER },
                cookTimeMinutes: { type: Type.NUMBER },
                difficulty: { type: Type.STRING, description: '쉬움, 보통, 도전 중 하나' },
                servings: { type: Type.NUMBER },
                nutrition: {
                  type: Type.OBJECT,
                  properties: {
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                    sodium: { type: Type.NUMBER },
                    fiber: { type: Type.NUMBER },
                  },
                  required: ['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber'],
                },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description: '채소/과일, 정육/생선/계란, 곡류/면/두부, 양념/오일/소스, 유제품/견과/기타 중 하나',
                      },
                    },
                    required: ['name', 'amount', 'unit', 'category'],
                  },
                },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.NUMBER },
                      instruction: { type: Type.STRING },
                      timerSeconds: { type: Type.NUMBER },
                      tip: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'instruction'],
                  },
                },
                chefTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                healthBenefit: { type: Type.STRING },
              },
              required: [
                'id',
                'name',
                'subTitle',
                'mealType',
                'categoryTag',
                'prepTimeMinutes',
                'cookTimeMinutes',
                'difficulty',
                'servings',
                'nutrition',
                'ingredients',
                'steps',
                'chefTips',
                'healthBenefit',
              ],
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('AI 모델로부터 응답을 받지 못했습니다.');
    }

    const parsedPlan = JSON.parse(text);
    parsedPlan.id = `ai-plan-${Date.now()}`;
    parsedPlan.targetGoal = goal;
    parsedPlan.targetGoalLabel = goalDescriptions[goal] ? goalDescriptions[goal].split(' ')[0] : '맞춤 식단';

    return res.json(parsedPlan);
  } catch (error: any) {
    console.error('Gemini meal plan generation error:', error);
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: error?.message || '맞춤 식단 생성 중 오류가 발생했습니다.',
    });
  }
});

// Single Meal Replacement / Swap
app.post('/api/mealplan/swap-meal', async (req, res) => {
  try {
    const { currentMealName, mealType, goal, targetCalories = 500, allergies = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'GEMINI_API_KEY 환경변수가 필요합니다.',
      });
    }

    const prompt = `현재 식단의 "${currentMealName}"(${mealType})을 대체할 다른 건강하고 맛있는 추천 식단과 상세 레시피를 1개 생성해주세요.
목표 칼로리: 약 ${targetCalories} kcal, 건강 목표: ${goal}, 배제 재료: ${allergies.join(', ') || '없음'}.
반드시 기존 메뉴("${currentMealName}")와는 다른 주재료를 사용한 신선한 건강 요리여야 합니다.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '당신은 전문 영양사입니다. 1개의 완벽한 대체 요리 레시피를 JSON 형식으로 제공하세요.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            subTitle: { type: Type.STRING },
            mealType: { type: Type.STRING },
            categoryTag: { type: Type.STRING },
            prepTimeMinutes: { type: Type.NUMBER },
            cookTimeMinutes: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            servings: { type: Type.NUMBER },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                sodium: { type: Type.NUMBER },
                fiber: { type: Type.NUMBER },
              },
              required: ['calories', 'protein', 'carbs', 'fat', 'sodium', 'fiber'],
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['name', 'amount', 'unit', 'category'],
              },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.NUMBER },
                  instruction: { type: Type.STRING },
                  timerSeconds: { type: Type.NUMBER },
                  tip: { type: Type.STRING },
                },
                required: ['stepNumber', 'instruction'],
              },
            },
            chefTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            healthBenefit: { type: Type.STRING },
          },
          required: [
            'id',
            'name',
            'subTitle',
            'mealType',
            'categoryTag',
            'prepTimeMinutes',
            'cookTimeMinutes',
            'difficulty',
            'servings',
            'nutrition',
            'ingredients',
            'steps',
            'chefTips',
            'healthBenefit',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('대체 메뉴 생성 실패');
    const meal = JSON.parse(text);
    meal.id = `swapped-${Date.now()}`;
    return res.json(meal);
  } catch (error: any) {
    console.error('Swap meal error:', error);
    return res.status(500).json({ error: error.message || '대체 메뉴 생성에 실패했습니다.' });
  }
});

// AI Nutritionist Consultation / Question
app.post('/api/nutrition/consult', async (req, res) => {
  try {
    const { question, mealContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'GEMINI_API_KEY 환경변수가 필요합니다.',
      });
    }

    const prompt = `사용자의 영양 질문에 대해 친절하고 전문적이며 실천 가능한 조언을 제공해 주세요.
[현재 식단 컨텍스트]: ${mealContext ? JSON.stringify(mealContext).slice(0, 500) : '주간 영양 식단'}
[사용자 질문]: ${question}

응답은 마크다운 형식으로 가독성 있게 작성해 주세요. 권장 섭취 팁, 피해야 할 습관, 식재료 대체 팁을 포함해 주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '당신은 상냥하고 전문적인 대한민국 임상영양사입니다. 과학적 근거에 기반하여 실천하기 쉬운 맞춤 영양 솔루션을 명쾌하게 답변하세요.',
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Nutrition consult error:', error);
    return res.status(500).json({ error: error.message || '상담 생성 실패' });
  }
});

// Vite middleware / Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
