import { IngredientCategory, PurchaseOption, RetailerRecommendation } from '../types';

export function getPurchaseOptionForIngredient(
  name: string,
  category: IngredientCategory
): PurchaseOption {
  const lower = name.toLowerCase();

  if (category === '정육/생선/계란') {
    if (lower.includes('닭가슴살') || lower.includes('닭안심')) {
      return {
        optionType: '가성비 대용량',
        packSize: '냉장/냉동 1kg (100g x 10팩 개별포장)',
        estPrice: '9,800원 ~ 13,500원',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    }
    if (lower.includes('계란') || lower.includes('달걀')) {
      return {
        optionType: '유기농/친환경',
        packSize: '무항생제 1+등급 대란 15구~30구',
        estPrice: '6,900원 ~ 9,500원',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (lower.includes('소고기') || lower.includes('우둔살') || lower.includes('설도')) {
      return {
        optionType: '신선 손질형',
        packSize: '1등급 한우/호주산 냉장 우둔살 300g 슬라이스',
        estPrice: '9,500원 ~ 15,000원',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
    if (lower.includes('연어') || lower.includes('고등어')) {
      return {
        optionType: '신선 손질형',
        packSize: '가시제거 노르웨이 생연어/순살고등어 2~4팩',
        estPrice: '8,500원 ~ 14,000원',
        badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      };
    }
    return {
      optionType: '일반 신선',
      packSize: '신선 냉장 소포장 300g~500g',
      estPrice: '7,000원 ~ 12,000원',
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    };
  }

  if (category === '채소/과일') {
    if (lower.includes('샐러드') || lower.includes('어린잎') || lower.includes('양상추')) {
      return {
        optionType: '신선 손질형',
        packSize: '세척 무농약 믹스샐러드 200g~400g (즉시섭취)',
        estPrice: '3,200원 ~ 5,500원',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (lower.includes('아보카도')) {
      return {
        optionType: '일반 신선',
        packSize: '생과 후숙 아보카도 3~5과 망포장',
        estPrice: '5,900원 ~ 8,900원',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (lower.includes('방울토마토') || lower.includes('토마토')) {
      return {
        optionType: '유기농/친환경',
        packSize: 'GAP/친환경 대추방울토마토 500g~750g 팩',
        estPrice: '4,500원 ~ 7,200원',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
    return {
      optionType: '유기농/친환경',
      packSize: '국내산 산지직송 손질 채소 1봉 (200g~400g)',
      estPrice: '2,000원 ~ 4,500원',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  if (category === '곡류/면/두부') {
    if (lower.includes('두부') || lower.includes('순두부')) {
      return {
        optionType: '유기농/친환경',
        packSize: '국산콩 100% 부침·찌개 겸용 300g~340g',
        estPrice: '2,800원 ~ 4,200원',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (lower.includes('두부면') || lower.includes('곤약면')) {
      return {
        optionType: '신선 손질형',
        packSize: '글루텐프리 고단백 두부면 100g 3~5팩',
        estPrice: '6,500원 ~ 9,800원',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    if (lower.includes('현미') || lower.includes('귀리') || lower.includes('잡곡')) {
      return {
        optionType: '가성비 대용량',
        packSize: '당해년도 햅곡 찰현미/귀리 2kg~4kg 지퍼백',
        estPrice: '8,900원 ~ 16,000원',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
  }

  if (category === '양념/오일/소스') {
    if (lower.includes('올리브유') || lower.includes('오일')) {
      return {
        optionType: '유기농/친환경',
        packSize: '엑스트라버진 냉압착 올리브오일 500ml',
        estPrice: '13,000원 ~ 22,000원',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (lower.includes('알룰로스') || lower.includes('스테비아')) {
      return {
        optionType: '일반 신선',
        packSize: '0kcal 천연 알룰로스 액상 700g',
        estPrice: '6,500원 ~ 9,000원',
        badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
      };
    }
    return {
      optionType: '일반 신선',
      packSize: '표준 가정용 규격 1개',
      estPrice: '2,500원 ~ 5,500원',
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    };
  }

  return {
    optionType: '일반 신선',
    packSize: '소포장 규격 1개/팩',
    estPrice: '3,000원 ~ 6,000원',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
  };
}

export function getRetailerRecommendations(name: string): RetailerRecommendation[] {
  const query = encodeURIComponent(name);

  return [
    {
      name: '쿠팡 로켓프레시',
      brand: '쿠팡 로켓프레시',
      url: `https://www.coupang.com/np/search?component=&q=${query}`,
      deliveryType: '내일 아침 7시 도착 (새벽배송)',
      color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
    },
    {
      name: '마켓컬리',
      brand: '마켓컬리',
      url: `https://www.kurly.com/search?sword=${query}`,
      deliveryType: '샛별배송 (풀콜드체인 새벽도착)',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
    },
    {
      name: '이마트 쓱배송',
      brand: '이마트 쓱배송',
      url: `https://www.ssg.com/search.ssg?target=all&query=${query}`,
      deliveryType: '원하는 시간대 당일 쓱배송',
      color: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    },
    {
      name: '네이버 장보기',
      brand: '네이버 장보기',
      url: `https://search.shopping.naver.com/search/all?query=${query}`,
      deliveryType: '동네마트·최저가 비교 배송',
      color: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
    },
  ];
}
