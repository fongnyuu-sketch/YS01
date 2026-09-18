import { ActivityLevel, Gender, PlanGoal, UserPersonalProfile } from '../types';

export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

export function getActivityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'active':
      return 1.725;
    case 'veryActive':
      return 1.9;
    default:
      return 1.4;
  }
}

export function calculatePersonalizedPlan(profile: {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: PlanGoal;
}): UserPersonalProfile {
  const bmr = calculateBMR(profile.gender, profile.weightKg, profile.heightCm, profile.age);
  const tdee = Math.round(bmr * getActivityMultiplier(profile.activityLevel));

  let targetCals = tdee;
  let carbRatio = 0.5;
  let proteinRatio = 0.25;
  let fatRatio = 0.25;

  switch (profile.goal) {
    case 'diet':
      // Safe calorie deficit: -400 kcal
      targetCals = Math.max(profile.gender === 'female' ? 1250 : 1500, tdee - 400);
      carbRatio = 0.4;
      proteinRatio = 0.35;
      fatRatio = 0.25;
      break;
    case 'muscle':
      // Calorie surplus for hypertrophy: +350 kcal
      targetCals = tdee + 350;
      carbRatio = 0.45;
      proteinRatio = 0.3;
      fatRatio = 0.25;
      break;
    case 'bloodsugar':
      targetCals = Math.max(1300, tdee - 150);
      carbRatio = 0.45;
      proteinRatio = 0.25;
      fatRatio = 0.3;
      break;
    case 'quick':
    case 'balanced':
    default:
      targetCals = tdee;
      carbRatio = 0.5;
      proteinRatio = 0.25;
      fatRatio = 0.25;
      break;
  }

  const recommendedCarbs = Math.round((targetCals * carbRatio) / 4);
  const recommendedProtein = Math.round((targetCals * proteinRatio) / 4);
  const recommendedFat = Math.round((targetCals * fatRatio) / 9);

  return {
    ...profile,
    bmr,
    tdee,
    recommendedCalories: targetCals,
    recommendedCarbs,
    recommendedProtein,
    recommendedFat,
  };
}
