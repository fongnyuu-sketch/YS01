export type DayOfWeek = '월' | '화' | '수' | '목' | '금' | '토' | '일';

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type PlanGoal = 'balanced' | 'diet' | 'muscle' | 'bloodsugar' | 'quick';

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary' // 좌식 (운동 거의 안 함)
  | 'light' // 가벼운 활동 (주 1~3일)
  | 'moderate' // 보통 활동 (주 3~5일)
  | 'active' // 활동적 (주 6~7일)
  | 'veryActive'; // 매우 활동적 (고강도 육체노동/선수)

export interface UserPersonalProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: PlanGoal;
  bmr?: number;
  tdee?: number;
  recommendedCalories?: number;
  recommendedCarbs?: number; // grams
  recommendedProtein?: number; // grams
  recommendedFat?: number; // grams
}

export interface NutritionInfo {
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  sodium: number; // mg
  fiber: number; // g
  sugar?: number; // g
}

export type IngredientCategory =
  | '채소/과일'
  | '정육/생선/계란'
  | '곡류/면/두부'
  | '양념/오일/소스'
  | '유제품/견과/기타';

export interface PurchaseOption {
  optionType: '유기농/친환경' | '신선 손질형' | '가성비 대용량' | '일반 신선';
  packSize: string;
  estPrice: string;
  badgeColor?: string;
}

export interface RetailerRecommendation {
  name: string;
  brand: '쿠팡 로켓프레시' | '마켓컬리' | '이마트 쓱배송' | '네이버 장보기' | '오아시스마켓';
  url: string;
  deliveryType: string;
  color: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  notes?: string;
  purchaseOption?: PurchaseOption;
  recommendedRetailers?: RetailerRecommendation[];
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  tip?: string;
}

export interface MealItem {
  id: string;
  name: string;
  subTitle: string;
  mealType: '아침' | '점심' | '저녁' | '간식';
  categoryTag: string; // e.g. "고단백", "저당", "식이섬유", "초간단 15분"
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: '쉬움' | '보통' | '도전';
  servings: number;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  chefTips: string[];
  healthBenefit: string;
  mainColor?: string;
}

export interface DayPlan {
  day: DayOfWeek;
  dayLabel: string;
  theme: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack?: MealItem;
  };
  totalNutrition: NutritionInfo;
}

export interface WeeklyMealPlan {
  id: string;
  title: string;
  tagline: string;
  targetGoal: PlanGoal;
  targetGoalLabel: string;
  targetCalories: number;
  macroRatio: {
    carbs: number;
    protein: number;
    fat: number;
  };
  summary: string;
  days: DayPlan[];
  dietaryGuidance: string[];
  userProfile?: UserPersonalProfile;
}

export interface UserCustomProfile {
  goal: PlanGoal;
  calorieTarget: number;
  allergies: string[];
  cookingTimePreference: 'quick' | 'standard' | 'elaborate';
  servings: number;
  excludeSpicy: boolean;
  lowSodium: boolean;
  additionalNotes: string;
  personalProfile?: UserPersonalProfile;
}

export interface GroceryItem extends Ingredient {
  checked: boolean;
  sourceMeals: string[];
}

// Community Types
export type PostCategory = 'review' | 'recipe' | 'tip';

export interface CommunityComment {
  id: string;
  author: string;
  avatarBg: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  category: PostCategory;
  categoryLabel: string;
  title: string;
  content: string;
  author: string;
  authorBadge: string;
  avatarBg: string;
  createdAt: string;
  rating: number; // 1 ~ 5
  ratingsCount: number;
  userRated?: number; // Current user rating if already rated
  likes: number;
  isLiked?: boolean;
  comments: CommunityComment[];
  recipeData?: {
    calories?: number;
    protein?: number;
    cookTimeMinutes?: number;
    ingredients?: string[];
    steps?: string[];
  };
  tags: string[];
}

