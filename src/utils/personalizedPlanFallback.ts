import { UserPersonalProfile, WeeklyMealPlan, DayPlan, MealItem, PlanGoal } from '../types';
import { ALL_DEFAULT_PLANS } from '../data/defaultPlans';

export function createPersonalizedPlanFromProfile(
  profile: UserPersonalProfile,
  allergies: string[] = [],
  excludeSpicy: boolean = false,
  lowSodium: boolean = false
): WeeklyMealPlan {
  // Use base plan according to goal
  const basePlan = ALL_DEFAULT_PLANS[profile.goal] || ALL_DEFAULT_PLANS.balanced;
  const targetCalories = profile.recommendedCalories || 1850;
  const calorieScaleFactor = targetCalories / (basePlan.targetCalories || 1800);

  const goalLabels: Record<PlanGoal, string> = {
    balanced: '균형 영양식',
    diet: '체지방 컷 다이어트',
    muscle: '근육 증량 벌크업',
    bloodsugar: '저염·저GI 혈당/혈압',
    quick: '15분 초간단 실속식',
  };

  const macroRatio =
    profile.goal === 'diet'
      ? { carbs: 40, protein: 35, fat: 25 }
      : profile.goal === 'muscle'
      ? { carbs: 45, protein: 30, fat: 25 }
      : profile.goal === 'bloodsugar'
      ? { carbs: 45, protein: 25, fat: 30 }
      : { carbs: 50, protein: 25, fat: 25 };

  // Scale meals proportionally
  const scaledDays: DayPlan[] = basePlan.days.map((day) => {
    const scaleMeal = (meal: MealItem): MealItem => {
      const scaledNutrition = {
        calories: Math.round(meal.nutrition.calories * calorieScaleFactor),
        protein: Math.round(meal.nutrition.protein * calorieScaleFactor),
        carbs: Math.round(meal.nutrition.carbs * calorieScaleFactor),
        fat: Math.round(meal.nutrition.fat * calorieScaleFactor),
        sodium: lowSodium
          ? Math.min(280, Math.round(meal.nutrition.sodium * 0.75))
          : Math.round(meal.nutrition.sodium * calorieScaleFactor),
        fiber: Math.round(meal.nutrition.fiber * 1.1),
        sugar: meal.nutrition.sugar,
      };

      const scaledIngredients = meal.ingredients.map((ing) => ({
        ...ing,
        amount: Math.round(ing.amount * calorieScaleFactor * 10) / 10,
      }));

      return {
        ...meal,
        nutrition: scaledNutrition,
        ingredients: scaledIngredients,
      };
    };

    const scaledMeals = {
      breakfast: scaleMeal(day.meals.breakfast),
      lunch: scaleMeal(day.meals.lunch),
      dinner: scaleMeal(day.meals.dinner),
      snack: day.meals.snack ? scaleMeal(day.meals.snack) : undefined,
    };

    const mealList = Object.values(scaledMeals).filter(Boolean) as MealItem[];
    const dayTotalNutrition = mealList.reduce(
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

    return {
      ...day,
      meals: scaledMeals,
      totalNutrition: dayTotalNutrition,
    };
  });

  return {
    ...basePlan,
    id: `personalized-plan-${Date.now()}`,
    title: `${profile.age}세 ${profile.gender === 'male' ? '남성' : '여성'} 맞춤 ${
      goalLabels[profile.goal]
    }`,
    tagline: `기초대사량 ${profile.bmr}kcal · 일일소비량 ${profile.tdee}kcal 기반 최적 설계`,
    targetGoal: profile.goal,
    targetGoalLabel: goalLabels[profile.goal],
    targetCalories,
    macroRatio,
    summary: `${profile.age}세 ${profile.gender === 'male' ? '남성' : '여성'}의 신체 스펙(키 ${
      profile.heightCm
    }cm, 체중 ${profile.weightKg}kg)과 ${
      profile.activityLevel === 'sedentary'
        ? '좌식'
        : profile.activityLevel === 'light'
        ? '가벼운 활동'
        : profile.activityLevel === 'moderate'
        ? '보통 활동'
        : '활동적'
    } 생활을 바탕으로 산출된 1일 목표 ${targetCalories} kcal 맞춤 7일 식단입니다.`,
    days: scaledDays,
    userProfile: profile,
    dietaryGuidance: [
      `일일 권장 탄수화물 ${profile.recommendedCarbs}g, 단백질 ${profile.recommendedProtein}g, 지방 ${profile.recommendedFat}g을 균형 있게 섭취하세요.`,
      `매 끼니 단백질원을 25~35g씩 고르게 나누어 근육 손실을 방지하고 포만감을 극대화합니다.`,
      `조리 시 정제염 대신 다시마·표고버섯 우린 물이나 천일염을 사용하여 나트륨 섭취를 조절하세요.`,
      `충분한 수분(체중 1kg당 30ml)을 식간에 나누어 섭취하세요.`,
    ],
  };
}
