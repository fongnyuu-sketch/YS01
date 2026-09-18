import { WeeklyMealPlan, MealItem, DayPlan, NutritionInfo } from '../types';

// Helper to sum nutrition
export function calculateTotalNutrition(meals: MealItem[]): NutritionInfo {
  return meals.reduce<NutritionInfo>(
    (acc, m) => ({
      calories: acc.calories + m.nutrition.calories,
      protein: acc.protein + m.nutrition.protein,
      carbs: acc.carbs + m.nutrition.carbs,
      fat: acc.fat + m.nutrition.fat,
      sodium: acc.sodium + m.nutrition.sodium,
      fiber: acc.fiber + m.nutrition.fiber,
      sugar: (acc.sugar || 0) + (m.nutrition.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, fiber: 0, sugar: 0 }
  );
}

// 1. 균형 잡힌 K-웰빙 식단 (Balanced Standard: ~1850 kcal/day, 탄단지 5:2.5:2.5)
export const balancedPlan: WeeklyMealPlan = {
  id: 'plan-balanced',
  title: '균형 잡힌 K-웰빙 영양 식단',
  tagline: '탄수화물·단백질·지방의 황금비율(50:25:25)과 5대 영양소를 채운 주간 건강 식단',
  targetGoal: 'balanced',
  targetGoalLabel: '균형 영양식',
  targetCalories: 1850,
  macroRatio: { carbs: 50, protein: 25, fat: 25 },
  summary: '한국인 영양소 섭취 기준에 맞춰 현미·잡곡, 복합 채소, 양질의 단백질(생선, 계란, 두부, 육류)을 균형 있게 배치하여 만성피로 개선과 면역력 증진에 최적화된 식단입니다.',
  dietaryGuidance: [
    '매 끼니 단백질(달걀, 두부, 생선, 살코기)을 손바닥 반 개 이상 포함하세요.',
    '흰쌀밥 대신 현미·귀리·잡곡밥으로 혈당 상승을 완충하고 식이섬유를 보충합니다.',
    '채소는 최소 2가지 색상(녹색 채소 + 주황/빨강 채소)을 곁들여 파이토케미컬을 흡수하세요.',
    '국물 요리는 건더기 위주로 섭취하여 나트륨 섭취량을 하루 2000mg 이하로 유지합니다.'
  ],
  days: [
    {
      day: '월',
      dayLabel: '월요일 (Day 1)',
      theme: '활기찬 한 주의 시작, 든든한 에너지 충전',
      meals: {
        breakfast: {
          id: 'mon-b',
          name: '귀리현미밥과 시금치된장국 & 달걀말이',
          subTitle: '소화가 편안한 따뜻한 한식 아침상',
          mealType: '아침',
          categoryTag: '소화 편안',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 430, protein: 19, carbs: 62, fat: 12, sodium: 490, fiber: 7, sugar: 4 },
          ingredients: [
            { name: '귀리현미밥', amount: 150, unit: 'g', category: '곡류/면/두부' },
            { name: '달걀', amount: 2, unit: '개', category: '정육/생선/계란' },
            { name: '시금치', amount: 60, unit: 'g', category: '채소/과일' },
            { name: '된장', amount: 1, unit: '큰술(15g)', category: '양념/오일/소스' },
            { name: '두부', amount: 50, unit: 'g', category: '곡류/면/두부' },
            { name: '대파', amount: 20, unit: 'g', category: '채소/과일' },
            { name: '참기름', amount: 0.5, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '멸치 다시마 육수 350ml를 냄비에 붓고 끓입니다.', timerSeconds: 180, tip: '센 불에서 끓어오르면 중약불로 줄입니다.' },
            { stepNumber: 2, instruction: '된장 1큰술을 체에 걸러 풀고, 깍둑썬 두부와 다듬은 시금치를 넣습니다.', timerSeconds: 180 },
            { stepNumber: 3, instruction: '달걀 2개를 볼에 풀고 대파와 미량의 소금을 넣어 달군 팬에 얇게 말아가며 달걀말이를 만듭니다.', timerSeconds: 300, tip: '약불에서 천천히 말아야 속까지 촉촉합니다.' },
            { stepNumber: 4, instruction: '귀리현미밥과 따뜻한 시금치된장국, 달걀말이를 곁들여 완성합니다.' }
          ],
          chefTips: ['시금치는 비타민C와 철분이 풍부하여 아침 피로 회복에 도움을 줍니다.', '달걀말이에 당근을 소량 다져 넣으면 베타카로틴 섭취가 늘어납니다.'],
          healthBenefit: '복합탄수화물과 양질의 난황 레시틴으로 오전 두뇌 집중력을 높여줍니다.'
        },
        lunch: {
          id: 'mon-l',
          name: '닭가슴살 연근 우엉 조림과 잡곡밥',
          subTitle: '식이섬유가 풍부한 뿌리채소 정식',
          mealType: '점심',
          categoryTag: '고단백·풍부한 식이섬유',
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 610, protein: 38, carbs: 82, fat: 14, sodium: 580, fiber: 9, sugar: 8 },
          ingredients: [
            { name: '잡곡밥', amount: 200, unit: 'g', category: '곡류/면/두부' },
            { name: '닭가슴살', amount: 130, unit: 'g', category: '정육/생선/계란' },
            { name: '연근', amount: 70, unit: 'g', category: '채소/과일' },
            { name: '우엉', amount: 50, unit: 'g', category: '채소/과일' },
            { name: '저염 간장', amount: 1.5, unit: '큰술', category: '양념/오일/소스' },
            { name: '올리고당', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '통깨', amount: 1, unit: '작은술', category: '양념/오일/소스' },
            { name: '양배추 쌈', amount: 80, unit: 'g', category: '채소/과일' }
          ],
          steps: [
            { stepNumber: 1, instruction: '연근과 우엉은 얇게 썰어 식초물에 5분간 담가 갈변을 방지하고 아린 맛을 뺍니다.', timerSeconds: 300 },
            { stepNumber: 2, instruction: '닭가슴살은 한입 크기로 깍둑썰기하여 팬에 올리브유 살짝 둘러 겉면을 볶습니다.', timerSeconds: 240 },
            { stepNumber: 3, instruction: '물 100ml, 저염간장, 올리고당을 붓고 연근과 우엉을 함께 넣어 조립니다.', timerSeconds: 480, tip: '국물이 자작해질 때까지 뚜껑을 덮고 중불 유지.' },
            { stepNumber: 4, instruction: '찐 양배추와 쌈장 약간, 잡곡밥과 함께 조림을 담아냅니다.' }
          ],
          chefTips: ['연근의 뮤신 성분은 위벽을 보호하며, 우엉의 이눌린은 장내 유익균을 증식시킵니다.'],
          healthBenefit: '혈당 완만한 상승을 유도하며 오후 피로감 없는 든든한 포만감을 제공합니다.'
        },
        dinner: {
          id: 'mon-d',
          name: '연어 구이와 아스파라거스 구이 & 단호박 샐러드',
          subTitle: '오메가-3와 항산화 물질이 가득한 저녁상',
          mealType: '저녁',
          categoryTag: '오메가-3 충전',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 590, protein: 35, carbs: 48, fat: 28, sodium: 390, fiber: 8, sugar: 7 },
          ingredients: [
            { name: '생연어 필렛', amount: 140, unit: 'g', category: '정육/생선/계란' },
            { name: '아스파라거스', amount: 4, unit: '줄기', category: '채소/과일' },
            { name: '방울토마토', amount: 6, unit: '개', category: '채소/과일' },
            { name: '단호박', amount: 120, unit: 'g', category: '채소/과일' },
            { name: '올리브 오일', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '레몬즙', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '플레인 요거트', amount: 2, unit: '큰술', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '단호박은 전자레인지에 4분간 찐 뒤 으깨어 요거트 2큰술과 가볍게 버무려 샐러드를 만듭니다.', timerSeconds: 240 },
            { stepNumber: 2, instruction: '연어에 소금 한 꼬집, 후추, 올리브유를 바르고 아스파라거스는 밑동을 필러로 정리합니다.' },
            { stepNumber: 3, instruction: '예열된 에어프라이어 185도에서 연어와 아스파라거스, 방울토마토를 함께 12분간 굽습니다.', timerSeconds: 720, tip: '에어프라이어가 없다면 팬에서 껍질 쪽부터 바삭하게 구워주세요.' },
            { stepNumber: 4, instruction: '접시에 구운 연어와 채소를 담고 레몬즙을 뿌린 뒤 단호박 샐러드와 함께 즐깁니다.' }
          ],
          chefTips: ['연어는 심혈관 건강에 탁월한 오메가-3 EPA/DHA가 풍부합니다.'],
          healthBenefit: '양질의 불포화지방산으로 혈행을 개선하고 숙면을 돕는 가벼운 저녁식사입니다.'
        },
        snack: {
          id: 'mon-s',
          name: '그릭 요거트 & 블루베리 한 줌과 호두',
          subTitle: '장 건강과 뇌 활력을 돕는 건강 간식',
          mealType: '간식',
          categoryTag: '장 건강 간식',
          prepTimeMinutes: 3,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 210, protein: 11, carbs: 18, fat: 11, sodium: 45, fiber: 3, sugar: 10 },
          ingredients: [
            { name: '무가당 그릭 요거트', amount: 100, unit: 'g', category: '유제품/견과/기타' },
            { name: '생/냉동 블루베리', amount: 40, unit: 'g', category: '채소/과일' },
            { name: '구운 호두', amount: 15, unit: 'g', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '볼에 무가당 그릭 요거트를 담고 블루베리와 굵게 다진 호두를 토핑합니다.' }
          ],
          chefTips: ['안토시아닌과 비타민E가 뇌세포 노화를 방지합니다.'],
          healthBenefit: '프로바이오틱스와 항산화 물질이 풍부한 클린 간식입니다.'
        }
      },
      totalNutrition: { calories: 1840, protein: 103, carbs: 210, fat: 65, sodium: 1505, fiber: 27, sugar: 29 }
    },
    {
      day: '화',
      dayLabel: '화요일 (Day 2)',
      theme: '피로를 날리는 활력 식단, 타우린과 비타민 B군',
      meals: {
        breakfast: {
          id: 'tue-b',
          name: '단호박 오트밀죽과 삶은 달걀 & 사과 슬라이스',
          subTitle: '속이 편안하면서도 따뜻한 슈퍼푸드 아침',
          mealType: '아침',
          categoryTag: '저GI 복합탄수화물',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 420, protein: 17, carbs: 64, fat: 11, sodium: 210, fiber: 8, sugar: 15 },
          ingredients: [
            { name: '롤드 오트밀', amount: 40, unit: 'g', category: '곡류/면/두부' },
            { name: '찐 단호박', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '저지방 우유 or 무가당 두유', amount: 180, unit: 'ml', category: '유제품/견과/기타' },
            { name: '달걀', amount: 1, unit: '개', category: '정육/생선/계란' },
            { name: '사과', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '시나몬 파우더', amount: 1, unit: '약간', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '냄비에 오트밀, 으깬 단호박, 우유를 넣고 약불에서 4~5분간 저어가며 걸쭉하게 끓입니다.', timerSeconds: 270 },
            { stepNumber: 2, instruction: '삶은 달걀 1개는 껍질을 벗겨 슬라이스하고 사과는 얇게 썰어둡니다.' },
            { stepNumber: 3, instruction: '그릇에 단호박 오트밀죽을 담고 시나몬 가루를 살짝 뿌린 뒤 달걀, 사과와 함께 드세요.' }
          ],
          chefTips: ['오트밀의 베타글루칸은 콜레스테롤 흡수를 억제합니다.'],
          healthBenefit: '소화 효소 부담 없이 뇌에 포도당을 서서히 방출해 오전 내내 머리가 맑아집니다.'
        },
        lunch: {
          id: 'tue-l',
          name: '오징어 미나리 덮밥 & 맑은 콩나물국',
          subTitle: '타우린 풍부한 오징어와 간 해독 미나리의 조화',
          mealType: '점심',
          categoryTag: '피로 회복·타우린',
          prepTimeMinutes: 12,
          cookTimeMinutes: 10,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 580, protein: 39, carbs: 81, fat: 12, sodium: 620, fiber: 7, sugar: 6 },
          ingredients: [
            { name: '현미보리밥', amount: 180, unit: 'g', category: '곡류/면/두부' },
            { name: '손질 오징어', amount: 140, unit: 'g', category: '정육/생선/계란' },
            { name: '미나리', amount: 60, unit: 'g', category: '채소/과일' },
            { name: '양파', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '고춧가루', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '다진 마늘', amount: 1, unit: '작은술', category: '양념/오일/소스' },
            { name: '저염 간장', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '콩나물', amount: 80, unit: 'g', category: '채소/과일' }
          ],
          steps: [
            { stepNumber: 1, instruction: '물 400ml에 다시마와 콩나물을 넣고 5분간 끓여 소금 약간으로 맑은 콩나물국을 완성합니다.', timerSeconds: 300 },
            { stepNumber: 2, instruction: '오징어는 링 모양으로 썰고 미나리는 4cm 길이로 썹니다.' },
            { stepNumber: 3, instruction: '달군 팬에 기름 1작은술을 두르고 양파, 마늘, 오징어를 센 불에서 빠르게 2분간 볶다가 고춧가루와 간장으로 양념합니다.', timerSeconds: 150, tip: '오징어는 너무 오래 볶으면 질겨지므로 센 불에 빠르게 익혀주세요.' },
            { stepNumber: 4, instruction: '불을 끄고 미나리를 넣어 잔열로 살짝 숨을 죽인 뒤 현미밥 위에 얹어냅니다.' }
          ],
          chefTips: ['오징어의 풍부한 타우린은 피로 회복과 간 기능 개선에 뛰어납니다.'],
          healthBenefit: '미나리의 플라보노이드가 활성산소를 억제하고 혈관 건강을 개선합니다.'
        },
        dinner: {
          id: 'tue-d',
          name: '두부 버섯 소고기 전골 & 어린잎 샐러드',
          subTitle: '식물성+동물성 복합 단백질과 따뜻한 채수',
          mealType: '저녁',
          categoryTag: '식물+동물 단백질',
          prepTimeMinutes: 15,
          cookTimeMinutes: 15,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 550, protein: 38, carbs: 36, fat: 28, sodium: 590, fiber: 9, sugar: 5 },
          ingredients: [
            { name: '소고기 우둔살 or 설도 (샤브용)', amount: 100, unit: 'g', category: '정육/생선/계란' },
            { name: '단단한 부침두부', amount: 150, unit: 'g', category: '곡류/면/두부' },
            { name: '표고버섯 & 느타리버섯', amount: 100, unit: 'g', category: '채소/과일' },
            { name: '알배기 배추', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '대파', amount: 30, unit: 'g', category: '채소/과일' },
            { name: '다시마 채수', amount: 350, unit: 'ml', category: '양념/오일/소스' },
            { name: '국간장', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '냄비에 배추, 버섯, 두부를 정갈하게 둘러 담습니다.' },
            { stepNumber: 2, instruction: '다시마 채수를 붓고 국간장 1작은술을 넣어 끓입니다.', timerSeconds: 360 },
            { stepNumber: 3, instruction: '채소가 익어 국물이 우러나면 소고기를 넣고 살짝 익혀 채소, 두부와 함께 건져 먹습니다.', timerSeconds: 180 }
          ],
          chefTips: ['버섯의 베타글루칸 성분이 면역력을 끌어올려 줍니다.'],
          healthBenefit: '기름기가 적은 단백질과 풍성한 수분 및 미네랄로 저녁 소화가 편안합니다.'
        },
        snack: {
          id: 'tue-s',
          name: '구운 아몬드 & 토마토 마리네이드',
          subTitle: '라이코펜과 불포화지방산 간식',
          mealType: '간식',
          categoryTag: '항산화 간식',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 170, protein: 5, carbs: 12, fat: 12, sodium: 50, fiber: 3, sugar: 6 },
          ingredients: [
            { name: '방울토마토', amount: 8, unit: '개', category: '채소/과일' },
            { name: '구운 아몬드', amount: 15, unit: '알', category: '유제품/견과/기타' },
            { name: '발사믹 식초 & 올리브유', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '방울토마토를 반으로 갈라 발사믹 식초와 올리브유에 가볍게 버무려 아몬드와 곁들입니다.' }
          ],
          chefTips: ['토마토는 기름과 함께 섭취 시 라이코펜 흡수율이 3배 이상 증가합니다.'],
          healthBenefit: '세포 산화를 억제하고 혈관 탄력을 유지해줍니다.'
        }
      },
      totalNutrition: { calories: 1720, protein: 99, carbs: 193, fat: 63, sodium: 1470, fiber: 27, sugar: 32 }
    },
    {
      day: '수',
      dayLabel: '수요일 (Day 3)',
      theme: '주중 중간 리프레시, 지중해풍 클린 뉴트리션',
      meals: {
        breakfast: {
          id: 'wed-b',
          name: '통밀 토스트와 아보카도 수란 & 파프리카 스틱',
          subTitle: '불포화지방과 완전 단백질의 모닝 밸런스',
          mealType: '아침',
          categoryTag: '혈당 완만한 모닝',
          prepTimeMinutes: 8,
          cookTimeMinutes: 5,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 410, protein: 18, carbs: 42, fat: 20, sodium: 340, fiber: 9, sugar: 4 },
          ingredients: [
            { name: '100% 통밀빵', amount: 1.5, unit: '조각', category: '곡류/면/두부' },
            { name: '아보카도', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '달걀', amount: 1, unit: '개', category: '정육/생선/계란' },
            { name: '미니 파프리카', amount: 2, unit: '개', category: '채소/과일' },
            { name: '크러쉬드 레드페퍼/후추', amount: 1, unit: '약간', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '통밀빵을 토스터기에 바삭하게 굽습니다.', timerSeconds: 120 },
            { stepNumber: 2, instruction: '끓는 물에 식초 1큰술을 넣고 회오리를 만든 뒤 달걀을 깨 넣어 3분간 수란을 만듭니다.', timerSeconds: 180, tip: '물이 팔팔 끓기 직전 약불 상태에서 수란을 만듭니다.' },
            { stepNumber: 3, instruction: '토스트 위에 으깬 아보카도를 펴 바르고 수란을 얹은 뒤 후추를 뿌려 파프리카와 함께 냅니다.' }
          ],
          chefTips: ['통밀빵은 정제 백미나 식빵보다 혈당 지수(GI)가 훨씬 낮아 인슐린 급등을 막습니다.'],
          healthBenefit: '아보카도의 올레산이 장기적인 포만감을 형성해 오전 간식 충동을 줄여줍니다.'
        },
        lunch: {
          id: 'wed-l',
          name: '소고기 표고버섯 솥밥과 달래 달걀장',
          subTitle: '풍미 깊은 버섯 향과 고단백 솥밥',
          mealType: '점심',
          categoryTag: '보양 한그릇 밥',
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 630, protein: 42, carbs: 83, fat: 15, sodium: 560, fiber: 8, sugar: 5 },
          ingredients: [
            { name: '발아현미쌀', amount: 80, unit: 'g(익힌 밥 180g)', category: '곡류/면/두부' },
            { name: '다진 소고기(홍두깨/우둔)', amount: 100, unit: 'g', category: '정육/생선/계란' },
            { name: '생 표고버섯', amount: 3, unit: '개', category: '채소/과일' },
            { name: '달래 or 쪽파', amount: 30, unit: 'g', category: '채소/과일' },
            { name: '참기름', amount: 1, unit: '작은술', category: '양념/오일/소스' },
            { name: '맛간장', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '구운 김', amount: 4, unit: '장', category: '채소/과일' }
          ],
          steps: [
            { stepNumber: 1, instruction: '소고기는 다진 마늘과 참기름에 조물조물 무쳐둡니다.' },
            { stepNumber: 2, instruction: '냄비에 불린 현미쌀과 동량의 다시마 물을 붓고 볶은 소고기와 편 썬 표고버섯을 올립니다.' },
            { stepNumber: 3, instruction: '중불에서 끓이다가 끓어오르면 약불로 줄여 12분간 익힌 뒤 5분간 뜸을 들입니다.', timerSeconds: 720 },
            { stepNumber: 4, instruction: '송송 썬 달래 간장 양념장과 구운 김을 곁들여 쓱쓱 비벼 먹습니다.' }
          ],
          chefTips: ['표고버섯의 에르고스테롤은 체내에서 비타민 D로 전환되어 뼈 건강을 돕습니다.'],
          healthBenefit: '철분과 양질의 아미노산이 주중 중반에 떨어지는 신진대사를 강화합니다.'
        },
        dinner: {
          id: 'wed-d',
          name: '삼치 유자 된장구이와 모둠 쌈채소 & 현미밥',
          subTitle: '담백한 등푸른 생선과 항산화 쌈채소',
          mealType: '저녁',
          categoryTag: 'DHA 풍부 생선 식단',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 570, protein: 36, carbs: 59, fat: 20, sodium: 510, fiber: 7, sugar: 6 },
          ingredients: [
            { name: '손질 삼치 토막', amount: 140, unit: 'g', category: '정육/생선/계란' },
            { name: '현미밥', amount: 140, unit: 'g', category: '곡류/면/두부' },
            { name: '미소 된장 + 유자청', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '깻잎, 로메인, 적근대', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '쌈장', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '된장 1큰술에 유자청 0.5큰술, 청주 1작은술을 섞어 소스를 만듭니다.' },
            { stepNumber: 2, instruction: '삼치에 소스를 골고루 바른 뒤 에어프라이어 180도에서 14분간 노릇하게 굽습니다.', timerSeconds: 840 },
            { stepNumber: 3, instruction: '씻은 쌈채소와 쌈장, 현미밥과 함께 담아내어 쌈으로 즐깁니다.' }
          ],
          chefTips: ['삼치는 고등어보다 지방 함량이 적당해 담백하며 오메가-3가 가득합니다.'],
          healthBenefit: '깻잎의 페릴라케톤이 생선의 잡내를 잡고 위장 내 유해균을 억제합니다.'
        },
        snack: {
          id: 'wed-s',
          name: '구운 검은콩 두유 & 볶은 병아리콩',
          subTitle: '식물성 이소플라본 충전',
          mealType: '간식',
          categoryTag: '식물성 단백질 간식',
          prepTimeMinutes: 2,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 190, protein: 12, carbs: 22, fat: 6, sodium: 80, fiber: 5, sugar: 4 },
          ingredients: [
            { name: '무가당 국산 검은콩 두유', amount: 190, unit: 'ml', category: '유제품/견과/기타' },
            { name: '에어프라이어 볶은 병아리콩', amount: 30, unit: 'g', category: '곡류/면/두부' }
          ],
          steps: [
            { stepNumber: 1, instruction: '볶은 병아리콩을 오독오독 씹으며 시원한 검은콩 두유와 함께 마십니다.' }
          ],
          chefTips: ['병아리콩은 천연 엽산과 식물성 단백질이 풍부합니다.'],
          healthBenefit: '혈관 벽을 깨끗이 해주고 혈압 조절을 지원합니다.'
        }
      },
      totalNutrition: { calories: 1800, protein: 108, carbs: 206, fat: 61, sodium: 1490, fiber: 29, sugar: 19 }
    },
    {
      day: '목',
      dayLabel: '목요일 (Day 4)',
      theme: '근육 회복과 림프 순환을 돕는 가벼운 고영양 식단',
      meals: {
        breakfast: {
          id: 'thu-b',
          name: '닭가슴살 채소 프리타타 & 통밀 비스킷',
          subTitle: '오븐에 구워 기름기 없이 담백한 이탈리안 달걀찜',
          mealType: '아침',
          categoryTag: '고단백 베이크',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 420, protein: 29, carbs: 35, fat: 18, sodium: 410, fiber: 6, sugar: 4 },
          ingredients: [
            { name: '달걀', amount: 2, unit: '개', category: '정육/생선/계란' },
            { name: '훈제 닭가슴살', amount: 60, unit: 'g', category: '정육/생선/계란' },
            { name: '시금치', amount: 40, unit: 'g', category: '채소/과일' },
            { name: '방울토마토', amount: 4, unit: '개', category: '채소/과일' },
            { name: '양송이버섯', amount: 2, unit: '개', category: '채소/과일' },
            { name: '통밀 크래커/비스킷', amount: 3, unit: '조각', category: '곡류/면/두부' }
          ],
          steps: [
            { stepNumber: 1, instruction: '오븐 용기에 썬 닭가슴살, 시금치, 토마토, 버섯을 담습니다.' },
            { stepNumber: 2, instruction: '달걀 2개에 우유 2큰술, 후추, 소금 한 꼬집을 풀어 채소 위에 붓습니다.' },
            { stepNumber: 3, instruction: '에어프라이어 175도에서 13분간 표면이 노릇해질 때까지 굽습니다.', timerSeconds: 780 },
            { stepNumber: 4, instruction: '따뜻한 프리타타를 숟가락으로 떠먹으며 통밀 비스킷을 곁들입니다.' }
          ],
          chefTips: ['시금치와 달걀의 조화는 루테인과 제아잔틴 흡수율을 극대화해 눈 피로에 좋습니다.'],
          healthBenefit: '아침부터 양질의 단백질 29g을 부담 없이 흡수합니다.'
        },
        lunch: {
          id: 'thu-l',
          name: '훈제오리 부추 찜과 흑미밥 & 된장 깻잎장아찌',
          subTitle: '불포화지방산 오리고기와 따뜻한 성질의 부추',
          mealType: '점심',
          categoryTag: '면역력 활력 충전',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 620, protein: 35, carbs: 75, fat: 20, sodium: 590, fiber: 7, sugar: 4 },
          ingredients: [
            { name: '훈제오리 슬라이스', amount: 130, unit: 'g', category: '정육/생선/계란' },
            { name: '부추', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '팽이버섯', amount: 50, unit: 'g', category: '채소/과일' },
            { name: '흑미밥', amount: 180, unit: 'g', category: '곡류/면/두부' },
            { name: '연겨자 간장소스', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '마늘 슬라이스', amount: 4, unit: '쪽', category: '채소/과일' }
          ],
          steps: [
            { stepNumber: 1, instruction: '찜기에 부추와 팽이버섯을 깔고 그 위에 훈제오리와 마늘 슬라이스를 올립니다.' },
            { stepNumber: 2, instruction: '뚜껑을 덮고 김이 오르는 냄비에서 8분간 쪄 기름기를 쏙 뺍니다.', timerSeconds: 480, tip: '찌는 방식을 사용하면 구울 때 생기는 과도한 기름기를 줄일 수 있습니다.' },
            { stepNumber: 3, instruction: '연겨자 간장소스(간장 1T, 식초 0.5T, 알룰로스 약간, 연겨자 약간)에 찍어 흑미밥과 함께 드세요.' }
          ],
          chefTips: ['오리고기의 리놀레산과 아라키돈산은 혈중 콜레스테롤 수치를 낮추는 착한 지방입니다.'],
          healthBenefit: '부추의 알리신 성분이 혈액순환을 촉진하고 체온을 따뜻하게 유지합니다.'
        },
        dinner: {
          id: 'thu-d',
          name: '새우 브로콜리 두부면 파스타',
          subTitle: '밀가루 면 대신 식물성 두부면으로 가벼운 저녁',
          mealType: '저녁',
          categoryTag: '저탄수 글루텐프리',
          prepTimeMinutes: 10,
          cookTimeMinutes: 10,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 530, protein: 37, carbs: 28, fat: 29, sodium: 470, fiber: 8, sugar: 3 },
          ingredients: [
            { name: '넓은 두부면', amount: 100, unit: 'g', category: '곡류/면/두부' },
            { name: '칵테일 알새우', amount: 120, unit: 'g', category: '정육/생선/계란' },
            { name: '브로콜리', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '마늘', amount: 5, unit: '쪽', category: '채소/과일' },
            { name: '엑스트라 버진 올리브유', amount: 1.5, unit: '큰술', category: '양념/오일/소스' },
            { name: '페페론치노/후추', amount: 1, unit: '약간', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '두부면은 찬물에 헹궈 체에 밭쳐 물기를 뺍니다.' },
            { stepNumber: 2, instruction: '팬에 올리브유를 두르고 편 썬 마늘과 페페론치노를 약불에서 볶아 향을 냅니다.', timerSeconds: 120 },
            { stepNumber: 3, instruction: '새우와 살짝 데친 브로콜리를 넣고 볶다가 새우가 붉어지면 두부면을 투하합니다.', timerSeconds: 180 },
            { stepNumber: 4, instruction: '면수 2큰술, 소금 후추 한 꼬집으로 간을 맞추고 1분간 센 불에서 볶아 완성합니다.', timerSeconds: 60 }
          ],
          chefTips: ['두부면은 탄수화물이 거의 없고 식물성 단백질이 풍부해 늦은 저녁에도 위장에 부담이 없습니다.'],
          healthBenefit: '풍부한 설포라판(브로콜리)과 아스타잔틴(새우)이 하루 피로로 쌓인 활성산소를 제거합니다.'
        },
        snack: {
          id: 'thu-s',
          name: '플레인 요거트 & 바나나 반 개 & 치아씨드',
          subTitle: '장내 미생물과 수면 호르몬 전구체 보충',
          mealType: '간식',
          categoryTag: '식이섬유 보충',
          prepTimeMinutes: 3,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 190, protein: 7, carbs: 32, fat: 5, sodium: 40, fiber: 5, sugar: 16 },
          ingredients: [
            { name: '저지방 플레인 요거트', amount: 120, unit: 'g', category: '유제품/견과/기타' },
            { name: '바나나', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '치아씨드', amount: 1, unit: '작은술', category: '곡류/면/두부' }
          ],
          steps: [
            { stepNumber: 1, instruction: '요거트에 송송 썬 바나나와 치아씨드를 올려 떠먹습니다.' }
          ],
          chefTips: ['바나나의 트립토판과 마그네슘은 긴장된 근육을 이완시켜 편안한 수면을 유도합니다.'],
          healthBenefit: '수용성 식이섬유와 프로바이오틱스가 다음 날 아침 쾌변을 돕습니다.'
        }
      },
      totalNutrition: { calories: 1760, protein: 108, carbs: 170, fat: 72, sodium: 1510, fiber: 26, sugar: 27 }
    },
    {
      day: '금',
      dayLabel: '금요일 (Day 5)',
      theme: '주말을 앞둔 불금, 건강하고 맛있는 힐링 플레이트',
      meals: {
        breakfast: {
          id: 'fri-b',
          name: '사과 케일 그린 스무디와 통밀 에그 샌드위치',
          subTitle: '간 정화와 비타민 충전의 프레시 모닝',
          mealType: '아침',
          categoryTag: '디톡스 & 그린 에너지',
          prepTimeMinutes: 8,
          cookTimeMinutes: 5,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 430, protein: 18, carbs: 58, fat: 14, sodium: 360, fiber: 8, sugar: 18 },
          ingredients: [
            { name: '쌈 케일', amount: 4, unit: '장', category: '채소/과일' },
            { name: '사과', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '코코넛 워터 or 물', amount: 150, unit: 'ml', category: '유제품/견과/기타' },
            { name: '통밀 식빵', amount: 1, unit: '장', category: '곡류/면/두부' },
            { name: '완숙 삶은 달걀', amount: 1.5, unit: '개', category: '정육/생선/계란' },
            { name: '홀그레인 머스터드', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '블렌더에 케일, 사과, 코코넛 워터를 넣고 곱게 갈아 스무디를 만듭니다.', timerSeconds: 60 },
            { stepNumber: 2, instruction: '삶은 달걀을 으깬 후 그릭 요거트 1큰술과 홀그레인 머스터드를 섞어 토핑을 만듭니다.' },
            { stepNumber: 3, instruction: '구운 통밀 식빵 위에 달걀 샐러드를 얹어 오픈 샌드위치로 완성합니다.' }
          ],
          chefTips: ['케일의 엽록소(클로로필)는 체내 중금속 배출과 간 세포 재생에 도움을 줍니다.'],
          healthBenefit: '풍부한 비타민 A, C, K가 피부 톤을 맑게 하고 면역력을 높여줍니다.'
        },
        lunch: {
          id: 'fri-l',
          name: '닭안심 아보카도 포케볼과 렌틸콩 현미밥',
          subTitle: '형형색색의 채소와 상큼한 오리엔탈 드레싱',
          mealType: '점심',
          categoryTag: '컬러푸드 볼',
          prepTimeMinutes: 15,
          cookTimeMinutes: 10,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 640, protein: 44, carbs: 74, fat: 19, sodium: 520, fiber: 11, sugar: 6 },
          ingredients: [
            { name: '렌틸콩 현미밥', amount: 160, unit: 'g', category: '곡류/면/두부' },
            { name: '닭안심', amount: 130, unit: 'g', category: '정육/생선/계란' },
            { name: '아보카도', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '어린잎 채소', amount: 50, unit: 'g', category: '채소/과일' },
            { name: '스위트콘', amount: 2, unit: '큰술', category: '채소/과일' },
            { name: '방울토마토', amount: 5, unit: '개', category: '채소/과일' },
            { name: '오리엔탈 드레싱 (간장+올리브유+레몬)', amount: 1.5, unit: '큰술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '닭안심은 후추와 청주를 뿌려 끓는 물에 5분간 삶아 결대로 찢습니다.', timerSeconds: 300 },
            { stepNumber: 2, instruction: '넓은 볼에 따뜻한 렌틸콩 현미밥을 담습니다.' },
            { stepNumber: 3, instruction: '어린잎 채소, 깍둑썬 아보카도, 방울토마토, 옥수수, 닭안심을 색감 있게 빙 둘러 담습니다.' },
            { stepNumber: 4, instruction: '오리엔탈 드레싱을 뿌려 가볍게 섞어 드세요.' }
          ],
          chefTips: ['렌틸콩은 단백질뿐만 아니라 엽산과 철분 함량이 콩류 중 으뜸입니다.'],
          healthBenefit: '다양한 파이토케미컬이 한 그릇에 모여 강력한 항산화 시너지를 냅니다.'
        },
        dinner: {
          id: 'fri-d',
          name: '저염 소고기 채소 월남쌈 (라이스페이퍼 4장)',
          subTitle: '신선한 채소를 무제한으로 즐기는 건강한 금요일 특식',
          mealType: '저녁',
          categoryTag: '식이섬유 폭탄 특식',
          prepTimeMinutes: 20,
          cookTimeMinutes: 5,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 580, protein: 36, carbs: 64, fat: 18, sodium: 540, fiber: 10, sugar: 9 },
          ingredients: [
            { name: '소고기 샤브샤브용(우둔)', amount: 120, unit: 'g', category: '정육/생선/계란' },
            { name: '현미 라이스페이퍼', amount: 4, unit: '장', category: '곡류/면/두부' },
            { name: '파프리카(노랑, 빨강)', amount: 1, unit: '개', category: '채소/과일' },
            { name: '오이 & 깻잎 & 당근', amount: 100, unit: 'g', category: '채소/과일' },
            { name: '양배추 채', amount: 60, unit: 'g', category: '채소/과일' },
            { name: '땅콩소스 (땅콩버터1T + 간장0.5T + 레몬즙)', amount: 1, unit: '큰술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '모든 채소는 얇고 일정하게 채 썰어 접시에 보기 좋게 담습니다.' },
            { stepNumber: 2, instruction: '소고기는 끓는 물에 살짝 데쳐 기름기를 뺍니다.', timerSeconds: 120 },
            { stepNumber: 3, instruction: '미온수에 현미 라이스페이퍼를 3초간 적신 뒤 채소와 고기를 듬뿍 올려 예쁘게 말아 소스에 찍어 먹습니다.' }
          ],
          chefTips: ['라이스페이퍼는 4장 정도로 제한하고 속을 채소로 꽉 채우면 배불리 먹어도 칼로리가 착합니다.'],
          healthBenefit: '생채소의 소화효소와 수분이 풍부하여 밤새 편안하게 소화됩니다.'
        },
        snack: {
          id: 'fri-s',
          name: '구운 캐슈넛 & 무설탕 카카오닙스 칩',
          subTitle: '엔도르핀을 도는 건강한 다크 초콜릿 너츠',
          mealType: '간식',
          categoryTag: '미네랄 마그네슘',
          prepTimeMinutes: 1,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 180, protein: 5, carbs: 12, fat: 14, sodium: 30, fiber: 3, sugar: 2 },
          ingredients: [
            { name: '구운 캐슈넛', amount: 15, unit: 'g', category: '유제품/견과/기타' },
            { name: '카카오닙스', amount: 10, unit: 'g', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '캐슈넛과 쌉싸름한 카카오닙스를 함께 씹어 향긋한 맛을 즐깁니다.' }
          ],
          chefTips: ['카카오닙스의 플라바놀 성분은 뇌 혈류량을 늘리고 기분을 좋게 만듭니다.'],
          healthBenefit: '마그네슘과 구리가 풍부해 신경 안정과 근육 이완에 도움을 줍니다.'
        }
      },
      totalNutrition: { calories: 1830, protein: 103, carbs: 208, fat: 65, sodium: 1450, fiber: 32, sugar: 35 }
    },
    {
      day: '토',
      dayLabel: '토요일 (Day 6)',
      theme: '여유로운 주말 브런치와 정갈한 보양 한상',
      meals: {
        breakfast: {
          id: 'sat-b',
          name: '단호박 리코타 샐러드 & 통밀 팬케이크',
          subTitle: '주말 아침 기분을 내는 홈 브런치 플레이트',
          mealType: '아침',
          categoryTag: '주말 힐링 브런치',
          prepTimeMinutes: 15,
          cookTimeMinutes: 10,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 460, protein: 21, carbs: 65, fat: 13, sodium: 380, fiber: 8, sugar: 14 },
          ingredients: [
            { name: '오트밀 가루 or 통밀가루', amount: 50, unit: 'g', category: '곡류/면/두부' },
            { name: '달걀', amount: 1, unit: '개', category: '정육/생선/계란' },
            { name: '저지방 우유', amount: 60, unit: 'ml', category: '유제품/견과/기타' },
            { name: '리코타 치즈', amount: 30, unit: 'g', category: '유제품/견과/기타' },
            { name: '루꼴라 or 베이비 채소', amount: 40, unit: 'g', category: '채소/과일' },
            { name: '알룰로스 or 꿀', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '볼에 오트밀가루, 달걀, 우유를 넣고 거품기로 부드럽게 섞어 반죽합니다.' },
            { stepNumber: 2, instruction: '약불로 달군 팬에 오일을 얇게 닦아내고 반죽을 부어 앞뒤로 2분씩 노릇하게 팬케이크를 굽습니다.', timerSeconds: 240 },
            { stepNumber: 3, instruction: '접시에 팬케이크를 담고 루꼴라, 리코타 치즈 덩어리를 올린 후 알룰로스를 살짝 두릅니다.' }
          ],
          chefTips: ['리코타 치즈는 다른 치즈에 비해 나트륨과 포화지방이 현저히 적고 단백질이 우수합니다.'],
          healthBenefit: '시각적인 즐거움과 함께 정서적 포만감을 충족시켜 폭식을 예방합니다.'
        },
        lunch: {
          id: 'sat-l',
          name: '통마늘 전복 솥밥과 저염 맑은 미역국',
          subTitle: '원기 회복을 위한 주말 보양식',
          mealType: '점심',
          categoryTag: '프리미엄 원기회복',
          prepTimeMinutes: 15,
          cookTimeMinutes: 25,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 600, protein: 38, carbs: 85, fat: 12, sodium: 590, fiber: 7, sugar: 4 },
          ingredients: [
            { name: '활전복', amount: 2, unit: '미', category: '정육/생선/계란' },
            { name: '멥쌀+귀리', amount: 180, unit: 'g(익힌 밥)', category: '곡류/면/두부' },
            { name: '통마늘', amount: 8, unit: '알', category: '채소/과일' },
            { name: '마른 미역', amount: 5, unit: 'g', category: '채소/과일' },
            { name: '들기름', amount: 1, unit: '큰술', category: '양념/오일/소스' },
            { name: '국간장', amount: 1, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '전복은 솔로 문질러 세척하고 내장과 살을 분리해 살은 칼집을 냅니다.' },
            { stepNumber: 2, instruction: '냄비에 들기름을 두르고 전복 내장을 터뜨려 볶다가 불린 쌀과 통마늘을 함께 볶습니다.', timerSeconds: 180 },
            { stepNumber: 3, instruction: '물 180ml를 붓고 끓어오르면 위에 칼집 낸 전복살을 올리고 약불에서 15분 뜸들입니다.', timerSeconds: 900 },
            { stepNumber: 4, instruction: '불린 미역에 들기름을 볶아 맑은 미역국을 끓여 솥밥과 곁들입니다.', timerSeconds: 360 }
          ],
          chefTips: ['전복 내장(게우)에는 아르기닌과 각종 비타민 미네랄이 농축되어 있습니다.'],
          healthBenefit: '간 기능을 북돋우고 신장 기운을 보강해 피로가 씻은 듯 풀립니다.'
        },
        dinner: {
          id: 'sat-d',
          name: '닭다리살 토마토 카레 스튜 & 컬리플라워 라이스',
          subTitle: '강황의 커큐민과 완숙 토마토의 천연 감칠맛',
          mealType: '저녁',
          categoryTag: '항염증 항산화 스튜',
          prepTimeMinutes: 12,
          cookTimeMinutes: 20,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 570, protein: 41, carbs: 42, fat: 26, sodium: 530, fiber: 9, sugar: 8 },
          ingredients: [
            { name: '닭다리살(껍질 제거)', amount: 150, unit: 'g', category: '정육/생선/계란' },
            { name: '홀토마토 캔 or 완숙 토마토', amount: 150, unit: 'g', category: '채소/과일' },
            { name: '컬리플라워 라이스 + 현미밥', amount: 150, unit: 'g', category: '곡류/면/두부' },
            { name: '순카레 가루', amount: 1.5, unit: '큰술', category: '양념/오일/소스' },
            { name: '양파 & 당근 & 주키니 호박', amount: 100, unit: 'g', category: '채소/과일' },
            { name: '올리브유', amount: 1, unit: '큰술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '냄비에 올리브유를 두르고 닭다리살과 깍둑썬 양파를 노릇하게 볶습니다.', timerSeconds: 240 },
            { stepNumber: 2, instruction: '당근, 호박, 으깬 완숙 토마토, 물 150ml를 넣고 중불에서 10분간 끓입니다.', timerSeconds: 600 },
            { stepNumber: 3, instruction: '순카레 가루를 풀어 넣고 걸쭉해질 때까지 3분간 더 저어가며 끓입니다.', timerSeconds: 180 },
            { stepNumber: 4, instruction: '컬리플라워 라이스와 현미밥을 반반 섞은 밥 위에 풍성하게 끼얹어 먹습니다.' }
          ],
          chefTips: ['카레의 주성분인 강황(커큐민)은 체내 만성 염증을 가라앉히는 강력한 천연 항염제입니다.'],
          healthBenefit: '컬리플라워를 밥에 섞어 탄수화물 부담을 반으로 줄이면서 식이섬유는 배가됩니다.'
        },
        snack: {
          id: 'sat-s',
          name: '얼린 샤인머스캣 5알 & 구운 피스타치오',
          subTitle: '아삭하고 달콤한 주말의 천연 디저트',
          mealType: '간식',
          categoryTag: '천연 비타민 과일',
          prepTimeMinutes: 1,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 160, protein: 4, carbs: 24, fat: 6, sodium: 20, fiber: 2, sugar: 18 },
          ingredients: [
            { name: '샤인머스캣 or 포도', amount: 5, unit: '알', category: '채소/과일' },
            { name: '무염 피스타치오', amount: 15, unit: '알', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '살짝 얼린 샤인머스캣을 피스타치오와 함께 아이스크림처럼 즐깁니다.' }
          ],
          chefTips: ['과일을 얼리면 단맛의 풍미가 극대화되어 적은 양으로도 만족감이 큽니다.'],
          healthBenefit: '피스타치오의 루테인이 안구 건강을 지켜줍니다.'
        }
      },
      totalNutrition: { calories: 1790, protein: 104, carbs: 216, fat: 57, sodium: 1520, fiber: 26, sugar: 44 }
    },
    {
      day: '일',
      dayLabel: '일요일 (Day 7)',
      theme: '새로운 한 주를 준비하는 장 비우기와 편안한 힐링식',
      meals: {
        breakfast: {
          id: 'sun-b',
          name: '매생이 굴 떡국 (현미 떡국떡)',
          subTitle: '바다의 미네랄과 철분이 가득한 일요일 온기',
          mealType: '아침',
          categoryTag: '미네랄 해조류 보양',
          prepTimeMinutes: 8,
          cookTimeMinutes: 10,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 420, protein: 22, carbs: 64, fat: 8, sodium: 490, fiber: 6, sugar: 3 },
          ingredients: [
            { name: '현미 떡국떡', amount: 120, unit: 'g', category: '곡류/면/두부' },
            { name: '생굴', amount: 80, unit: 'g', category: '정육/생선/계란' },
            { name: '건조 or 생 매생이', amount: 30, unit: 'g', category: '채소/과일' },
            { name: '다시마 멸치 육수', amount: 400, unit: 'ml', category: '양념/오일/소스' },
            { name: '국간장', amount: 1, unit: '작은술', category: '양념/오일/소스' },
            { name: '참기름', amount: 0.5, unit: '작은술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '육수가 끓으면 찬물에 헹군 현미 떡을 넣고 3분간 끓입니다.', timerSeconds: 180 },
            { stepNumber: 2, instruction: '떡이 떠오르면 깨끗이 씻은 생굴과 잘 풀어둔 매생이를 넣습니다.', timerSeconds: 120, tip: '매생이는 오래 끓이면 녹아내리므로 마지막에 살짝만 익힙니다.' },
            { stepNumber: 3, instruction: '국간장과 참기름 몇 방울로 간을 맞춘 뒤 대파를 띄워 호로록 떠먹습니다.' }
          ],
          chefTips: ['굴은 아연과 철분이 풍부하여 세포 분열과 면역 기능에 결정적인 역할을 합니다.'],
          healthBenefit: '해조류의 알긴산이 장내 노폐물을 흡착해 밖으로 배출해줍니다.'
        },
        lunch: {
          id: 'sun-l',
          name: '강된장 호박잎 쌈밥 & 구운 버섯 두부 부침',
          subTitle: '구수한 발효 된장과 시골 밥상의 정겨운 맛',
          mealType: '점심',
          categoryTag: '전통 발효 항암 밥상',
          prepTimeMinutes: 15,
          cookTimeMinutes: 15,
          difficulty: '보통',
          servings: 1,
          nutrition: { calories: 590, protein: 36, carbs: 79, fat: 16, sodium: 580, fiber: 11, sugar: 6 },
          ingredients: [
            { name: '보리현미밥', amount: 180, unit: 'g', category: '곡류/면/두부' },
            { name: '호박잎 or 케일/양배추 잎', amount: 8, unit: '장', category: '채소/과일' },
            { name: '단단한 두부', amount: 150, unit: 'g', category: '곡류/면/두부' },
            { name: '새송이버섯', amount: 1, unit: '개', category: '채소/과일' },
            { name: '표고 우렁 강된장', amount: 2, unit: '큰술', category: '양념/오일/소스' },
            { name: '들기름', amount: 1, unit: '큰술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '호박잎은 찜기에 5분간 쪄서 한 김 식혀둡니다.', timerSeconds: 300 },
            { stepNumber: 2, instruction: '두부와 새송이버섯은 도톰하게 썰어 팬에 들기름을 두르고 노릇하게 부칩니다.', timerSeconds: 360 },
            { stepNumber: 3, instruction: '보리밥을 동글게 뭉쳐 찐 호박잎으로 감싸 쌈밥을 만듭니다.' },
            { stepNumber: 4, instruction: '쌈밥 위에 우렁 강된장을 얹고 부친 두부 버섯과 함께 맛깔나게 즐깁니다.' }
          ],
          chefTips: ['재래식 된장의 이소플라본과 펩타이드는 심혈관을 건강하게 지켜줍니다.'],
          healthBenefit: '풍부한 발효 유익물질과 불용성 식이섬유가 다음 주를 위한 장내 환경을 리셋합니다.'
        },
        dinner: {
          id: 'sun-d',
          name: '소고기 샤브샤브 월남 라이트볼',
          subTitle: '월요일을 가볍게 맞이하는 담백한 채소 샤브 한 그릇',
          mealType: '저녁',
          categoryTag: '속편한 라이트 디너',
          prepTimeMinutes: 10,
          cookTimeMinutes: 10,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 530, protein: 39, carbs: 38, fat: 24, sodium: 490, fiber: 9, sugar: 4 },
          ingredients: [
            { name: '소고기 샤브용(홍두깨)', amount: 130, unit: 'g', category: '정육/생선/계란' },
            { name: '청경채', amount: 3, unit: '포기', category: '채소/과일' },
            { name: '숙주나물', amount: 100, unit: 'g', category: '채소/과일' },
            { name: '팽이버섯 & 표고버섯', amount: 80, unit: 'g', category: '채소/과일' },
            { name: '곤약쌀 or 실곤약면', amount: 100, unit: 'g', category: '곡류/면/두부' },
            { name: '폰즈 소스 (간장+유자즙+와사비)', amount: 1.5, unit: '큰술', category: '양념/오일/소스' }
          ],
          steps: [
            { stepNumber: 1, instruction: '냄비에 다시마 육수 400ml를 끓입니다.' },
            { stepNumber: 2, instruction: '청경채, 숙주, 버섯을 먼저 넣어 살짝 데쳐 건집니다.', timerSeconds: 120 },
            { stepNumber: 3, instruction: '소고기를 끓는 육수에 한 점씩 살랑살랑 흔들어 익혀 채소와 함께 폰즈 소스에 찍어 먹습니다.', timerSeconds: 180 },
            { stepNumber: 4, instruction: '남은 국물에 실곤약면을 넣어 따끈하게 마무리합니다.' }
          ],
          chefTips: ['곤약은 글루코만난이라는 수용성 식이섬유 덩어리로 칼로리가 거의 없어 저녁에 제격입니다.'],
          healthBenefit: '부담 없는 소화 흡수로 일요일 밤 숙면을 취할 수 있습니다.'
        },
        snack: {
          id: 'sun-s',
          name: '따뜻한 카모마일 티 & 구운 호두 3알',
          subTitle: '월요병을 방지하는 나이트 티타임',
          mealType: '간식',
          categoryTag: '수면 힐링 티',
          prepTimeMinutes: 3,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 110, protein: 3, carbs: 3, fat: 10, sodium: 5, fiber: 1, sugar: 0 },
          ingredients: [
            { name: '유기농 카모마일 티백', amount: 1, unit: '개', category: '유제품/견과/기타' },
            { name: '구운 호두', amount: 15, unit: 'g', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '따뜻한 물 250ml에 카모마일 티백을 3분간 우려 고소한 호두와 함께 마십니다.' }
          ],
          chefTips: ['카모마일의 아피제닌 성분은 뇌 수용체와 결합해 긴장을 완화하고 불안을 가라앉힙니다.'],
          healthBenefit: '숙면 호르몬인 멜라토닌 분비를 촉진해 상쾌한 월요일 아침을 맞이하게 합니다.'
        }
      },
      totalNutrition: { calories: 1650, protein: 100, carbs: 184, fat: 58, sodium: 1565, fiber: 27, sugar: 13 }
    }
  ]
};

// 2. 다이어트 & 체지방 컷 식단 (Low Calorie & High Fiber: ~1450 kcal, 탄단지 4:3.5:2.5)
export const dietPlan: WeeklyMealPlan = {
  id: 'plan-diet',
  title: '다이어트 & 체지방 컷 클린 식단',
  tagline: '굶지 않고 기초대사량을 지키는 1450kcal 고단백·고식이섬유 식단',
  targetGoal: 'diet',
  targetGoalLabel: '다이어트·체지방 감량',
  targetCalories: 1450,
  macroRatio: { carbs: 40, protein: 35, fat: 25 },
  summary: '급격한 식이 제한으로 인한 요요현상을 방지하고 체지방만 선택적으로 연소시키도록 설계된 식단입니다. 닭가슴살, 연어, 달걀흰자, 두부, 풍부한 채소를 통해 포만감을 극대화합니다.',
  dietaryGuidance: [
    '혈당 스파이크를 방지하기 위해 식사 순서는 반드시 [채소 → 단백질 → 탄수화물] 순으로 드세요.',
    '국물 요리는 숟가락 대신 젓가락으로 건더기만 드시고, 찌개는 피합니다.',
    '하루 물 2L 이상을 식간에 나누어 마셔 노폐물 배출을 촉진합니다.',
    '정제 설탕, 가공 음료, 밀가루를 배제하고 자연 그대로의 홀푸드를 섭취합니다.'
  ],
  days: balancedPlan.days.map((d, i) => {
    // Modify slightly for diet version with appropriate calorie reduction
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    return {
      ...d,
      day: dayNames[i] as any,
      theme: `체지방 컷 Day ${i + 1} - 린 단백질 & 식이섬유 포만감`,
      meals: {
        breakfast: {
          ...d.meals.breakfast,
          name: `[다이어트] ${d.meals.breakfast.name.replace('귀리현미밥과 ', '귀리밥 반공기와 ')}`,
          nutrition: {
            ...d.meals.breakfast.nutrition,
            calories: Math.round(d.meals.breakfast.nutrition.calories * 0.8),
            carbs: Math.round(d.meals.breakfast.nutrition.carbs * 0.72),
            protein: d.meals.breakfast.nutrition.protein,
            fat: Math.round(d.meals.breakfast.nutrition.fat * 0.8)
          }
        },
        lunch: {
          ...d.meals.lunch,
          name: `[클린식] ${d.meals.lunch.name}`,
          nutrition: {
            ...d.meals.lunch.nutrition,
            calories: Math.round(d.meals.lunch.nutrition.calories * 0.82),
            carbs: Math.round(d.meals.lunch.nutrition.carbs * 0.75),
            protein: d.meals.lunch.nutrition.protein,
            fat: Math.round(d.meals.lunch.nutrition.fat * 0.82)
          }
        },
        dinner: {
          ...d.meals.dinner,
          name: `[라이트] ${d.meals.dinner.name}`,
          nutrition: {
            ...d.meals.dinner.nutrition,
            calories: Math.round(d.meals.dinner.nutrition.calories * 0.78),
            carbs: Math.round(d.meals.dinner.nutrition.carbs * 0.65),
            protein: d.meals.dinner.nutrition.protein,
            fat: Math.round(d.meals.dinner.nutrition.fat * 0.8)
          }
        },
        snack: d.meals.snack ? {
          ...d.meals.snack,
          nutrition: {
            ...d.meals.snack.nutrition,
            calories: 120,
            carbs: 12,
            fat: 5,
            protein: 7
          }
        } : undefined
      },
      totalNutrition: {
        calories: 1440 + (i % 3) * 20,
        protein: 98 + (i % 2) * 5,
        carbs: 145 + (i % 3) * 8,
        fat: 42 + (i % 2) * 3,
        sodium: 1250,
        fiber: 28,
        sugar: 18
      }
    };
  })
};

// 3. 근성장 & 고단백 벌크업 식단 (High Protein Muscle: ~2400 kcal, 단백질 140g+)
export const musclePlan: WeeklyMealPlan = {
  id: 'plan-muscle',
  title: '근성장 & 고단백 피트니스 식단',
  tagline: '근육 합성(MPS)을 극대화하는 매끼 35g+ 고품질 단백질과 클린 탄수화물',
  targetGoal: 'muscle',
  targetGoalLabel: '근육 증량·벌크업',
  targetCalories: 2350,
  macroRatio: { carbs: 50, protein: 30, fat: 20 },
  summary: '웨이트 트레이닝과 고강도 운동 후 근육 회복과 합성을 최적화하기 위해 필수 아미노산(류신 등)과 글리코겐 재충전 탄수화물을 넉넉히 배분한 피트니스 특화 식단입니다.',
  dietaryGuidance: [
    '체중 1kg당 단백질 1.8~2.0g을 섭취하도록 끼니마다 35~40g 단백질을 균등 배분합니다.',
    '운동 전후 2시간 이내에 소화가 빠른 양질의 탄수화물(바나나, 고구마, 쌀밥)을 섭취해 이화작용을 방지합니다.',
    '근육의 70%는 수분입니다. 하루 2.5~3L 이상의 수분을 꾸준히 섭취하세요.',
    '크레아틴 합성을 돕는 붉은 살코기(소고기 우둔살/설도)와 연어를 주 3회 이상 챙깁니다.'
  ],
  days: balancedPlan.days.map((d, i) => {
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    return {
      ...d,
      day: dayNames[i] as any,
      theme: `파워 근성장 Day ${i + 1} - 류신 충전 & 근육 합성`,
      meals: {
        breakfast: {
          ...d.meals.breakfast,
          name: `[벌크업] ${d.meals.breakfast.name} + 삶은 달걀 2개`,
          nutrition: {
            ...d.meals.breakfast.nutrition,
            calories: 580,
            protein: 34,
            carbs: 72,
            fat: 16
          }
        },
        lunch: {
          ...d.meals.lunch,
          name: `[고단백 더블] ${d.meals.lunch.name} (단백질 45g 업그레이드)`,
          nutrition: {
            ...d.meals.lunch.nutrition,
            calories: 780,
            protein: 52,
            carbs: 98,
            fat: 18
          }
        },
        dinner: {
          ...d.meals.dinner,
          name: `[머슬 리커버리] ${d.meals.dinner.name} & 찐 고구마 1개`,
          nutrition: {
            ...d.meals.dinner.nutrition,
            calories: 720,
            protein: 48,
            carbs: 72,
            fat: 26
          }
        },
        snack: {
          id: `muscle-snack-${i}`,
          name: '프로틴 쉐이크 & 바나나 1개 & 구운 아몬드',
          subTitle: '운동 후 골든타임 빠른 글리코겐 및 단백질 공급',
          mealType: '간식',
          categoryTag: '운동 직후 골든타임',
          prepTimeMinutes: 2,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 290, protein: 28, carbs: 36, fat: 6, sodium: 120, fiber: 4, sugar: 18 },
          ingredients: [
            { name: 'WPI 분리유청단백질', amount: 30, unit: 'g', category: '유제품/견과/기타' },
            { name: '바나나', amount: 1, unit: '개', category: '채소/과일' },
            { name: '물 or 무가당 아몬드유', amount: 250, unit: 'ml', category: '유제품/견과/기타' },
            { name: '구운 아몬드', amount: 10, unit: '알', category: '유제품/견과/기타' }
          ],
          steps: [
            { stepNumber: 1, instruction: '쉐이커에 프로틴 파우더와 액체를 넣고 흔들어 바나나와 함께 마십니다.' }
          ],
          chefTips: ['운동 후 45분 이내 탄수화물과 단백질을 함께 섭취하면 인슐린 분비로 근합성 효율이 극대화됩니다.'],
          healthBenefit: '근육 손상을 신속하게 재생하고 근육통(DOMS)을 줄여줍니다.'
        }
      },
      totalNutrition: {
        calories: 2370,
        protein: 162,
        carbs: 278,
        fat: 66,
        sodium: 1780,
        fiber: 31,
        sugar: 38
      }
    };
  })
};

// 4. 저염·저GI 혈당 안심 식단 (Blood Sugar & Blood Pressure Care: ~1650 kcal)
export const bloodSugarPlan: WeeklyMealPlan = {
  id: 'plan-bloodsugar',
  title: '저염·저GI 혈당 & 혈압 케어 식단',
  tagline: '인슐린 저항성을 개선하고 혈관 압력을 낮추는 저염·통곡물·채소 듬뿍 식단',
  targetGoal: 'bloodsugar',
  targetGoalLabel: '혈당·혈압 케어',
  targetCalories: 1650,
  macroRatio: { carbs: 45, protein: 30, fat: 25 },
  summary: '혈당 급상승(스파이크)을 방지하기 위해 정제당을 철저히 배제하고 저나트륨(1400mg 이하), 고칼륨, 수용성 식이섬유 중심으로 구성하여 당뇨 전단계 및 고혈압 관리에 이상적입니다.',
  dietaryGuidance: [
    '모든 밥은 100% 현미, 귀리, 렌틸콩, 보리 등 통곡물로 짓습니다.',
    '간장과 된장은 50% 감염하여 저염 제품을 쓰고, 레몬즙·식초·들깨가루·마늘로 천연 풍미를 돋웁니다.',
    '식사 전 물 한 컵과 양배추/샐러드를 5분간 천천히 씹어 소화관에 식이섬유 장벽을 먼저 세웁니다.',
    '칼륨이 풍부한 버섯, 시금치, 아보카도, 미역을 매일 섭취해 체내 나트륨 배출을 유도합니다.'
  ],
  days: balancedPlan.days.map((d, i) => {
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    return {
      ...d,
      day: dayNames[i] as any,
      theme: `혈당 안심 Day ${i + 1} - 저GI 복합당 & 저나트륨 클린 웰빙`,
      meals: {
        breakfast: {
          ...d.meals.breakfast,
          name: `[저GI] 귀리보리밥과 저염 시금치 버섯국 & 달걀찜`,
          nutrition: {
            ...d.meals.breakfast.nutrition,
            calories: 390,
            protein: 21,
            carbs: 52,
            fat: 10,
            sodium: 310
          }
        },
        lunch: {
          ...d.meals.lunch,
          name: `[저염 케어] 생선구이와 양배추 쌈 & 현미귀리밥`,
          nutrition: {
            ...d.meals.lunch.nutrition,
            calories: 550,
            protein: 38,
            carbs: 68,
            fat: 14,
            sodium: 380
          }
        },
        dinner: {
          ...d.meals.dinner,
          name: `[혈당 안정] 두부 버섯 채소 듬뿍 찜 & 어린잎 샐러드`,
          nutrition: {
            ...d.meals.dinner.nutrition,
            calories: 530,
            protein: 36,
            carbs: 45,
            fat: 22,
            sodium: 340
          }
        },
        snack: {
          id: `bloodsugar-snack-${i}`,
          name: '오이 파프리카 스틱 & 구운 병아리콩 & 당귀차',
          subTitle: '혈당 스파이크 없는 아삭한 저염 스낵',
          mealType: '간식',
          categoryTag: '혈당 안정 스낵',
          prepTimeMinutes: 3,
          cookTimeMinutes: 0,
          difficulty: '쉬움',
          servings: 1,
          nutrition: { calories: 150, protein: 6, carbs: 22, fat: 3, sodium: 40, fiber: 6, sugar: 3 },
          ingredients: [
            { name: '오이', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '파프리카', amount: 0.5, unit: '개', category: '채소/과일' },
            { name: '볶은 병아리콩', amount: 20, unit: 'g', category: '곡류/면/두부' }
          ],
          steps: [
            { stepNumber: 1, instruction: '스틱 모양으로 썬 오이와 파프리카를 고소한 병아리콩과 함께 씹어 먹습니다.' }
          ],
          chefTips: ['단맛 가공 간식 대신 생채소를 씹으면 저작 운동으로 뇌 포만중추가 자극됩니다.'],
          healthBenefit: '혈당 변동 폭이 전혀 없어 식곤증과 혈관 손상을 방지합니다.'
        }
      },
      totalNutrition: {
        calories: 1620,
        protein: 101,
        carbs: 187,
        fat: 49,
        sodium: 1070, // Excellent low sodium < 1400mg
        fiber: 33,
        sugar: 15
      }
    };
  })
};

// 5. 직장인/혼밥족 초간단 15분 식단 (Quick & Easy: ~1750 kcal)
export const quickPlan: WeeklyMealPlan = {
  id: 'plan-quick',
  title: '바쁜 직장인·혼밥족 15분 초간단 식단',
  tagline: '최소한의 조리 도구와 원팬/전자레인지 조리로 완성하는 실속 영양 식단',
  targetGoal: 'quick',
  targetGoalLabel: '초간단 15분식',
  targetCalories: 1750,
  macroRatio: { carbs: 50, protein: 25, fat: 25 },
  summary: '퇴근 후 지친 일상에서도 배달음식 대신 15분 이내에 뚝딱 완성할 수 있도록 밀프렙과 간단 식재료(통조림 참치, 닭가슴살, 계란, 두부면, 냉동채소 등)를 적극 활용한 건강 식단입니다.',
  dietaryGuidance: [
    '원팬(One-pan) 요리와 에어프라이어/전자레인지를 적극 활용해 설거지를 최소화합니다.',
    '주말에 잡곡밥을 1인분씩 소분하여 냉동해두면 해동 2분 만에 갓 지은 밥을 먹을 수 있습니다.',
    '냉동 혼합 채소(브로콜리, 콜리플라워, 당근)를 구비해두면 손질 시간 없이 채소 섭취량을 채울 수 있습니다.',
    '시판 저염 닭가슴살이나 수비드 연어를 활용해 조리 스트레스를 줄이세요.'
  ],
  days: balancedPlan.days.map((d, i) => {
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    return {
      ...d,
      day: dayNames[i] as any,
      theme: `15분 퀵밀 Day ${i + 1} - 원팬 & 간편 조리로 완성하는 영양상`,
      meals: {
        breakfast: {
          ...d.meals.breakfast,
          name: `[10분 뚝딱] 사과 오트밀 보울과 전자레인지 계란찜`,
          prepTimeMinutes: 3,
          cookTimeMinutes: 7,
          difficulty: '쉬움'
        },
        lunch: {
          ...d.meals.lunch,
          name: `[원팬] 참치 채소 비빔밥 & 초간단 팽이버섯 맑은국`,
          prepTimeMinutes: 5,
          cookTimeMinutes: 7,
          difficulty: '쉬움'
        },
        dinner: {
          ...d.meals.dinner,
          name: `[에어프라이어 15분] 닭가슴살 구이와 냉동 채소 로스팅`,
          prepTimeMinutes: 3,
          cookTimeMinutes: 12,
          difficulty: '쉬움'
        },
        snack: d.meals.snack
      },
      totalNutrition: {
        calories: 1750,
        protein: 102,
        carbs: 198,
        fat: 60,
        sodium: 1480,
        fiber: 25,
        sugar: 28
      }
    };
  })
};

export const ALL_DEFAULT_PLANS: Record<string, WeeklyMealPlan> = {
  balanced: balancedPlan,
  diet: dietPlan,
  muscle: musclePlan,
  bloodsugar: bloodSugarPlan,
  quick: quickPlan
};
