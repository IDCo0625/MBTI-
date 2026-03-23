/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Rocket,
  CheckCircle2
} from 'lucide-react';

// --- Types ---
type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

interface Question {
  id: number;
  text: string;
  dimension: Dimension;
}

interface ResultData {
  mbti: string;
  items: string[];
  description: string;
}

// --- Data ---
const QUESTIONS: Question[] = [
  // E vs I (1-15)
  { id: 1, text: "친구들과 떠들며 조별 과제를 할 때 아이디어가 잘 나온다.", dimension: 'E' },
  { id: 2, text: "혼자 조용히 생각할 때 기발한 아이디어가 더 잘 떠오른다.", dimension: 'I' },
  { id: 3, text: "학교 축제 때 부스 앞에서 홍보하고 손님 끄는 게 즐겁다.", dimension: 'E' },
  { id: 4, text: "축제 때 뒤에서 물건을 정리하거나 준비하는 게 더 편하다.", dimension: 'I' },
  { id: 5, text: "처음 본 사람과도 금방 친해져서 대화할 수 있다.", dimension: 'E' },
  { id: 6, text: "친한 친구 몇 명과 깊게 이야기하는 것을 선호한다.", dimension: 'I' },
  { id: 7, text: "발표 수업 때 주목받는 것이 크게 부담스럽지 않다.", dimension: 'E' },
  { id: 8, text: "여러 사람 앞에서 발표하는 건 너무 긴장되는 일이다.", dimension: 'I' },
  { id: 9, text: "주말에 친구들을 만나 놀아야 공부할 기운이 난다.", dimension: 'E' },
  { id: 10, text: "주말에 집에서 혼자 쉬어야 에너지가 충전된다.", dimension: 'I' },
  { id: 11, text: "모르는 친구에게 먼저 다가가 말을 거는 게 어렵지 않다.", dimension: 'E' },
  { id: 12, text: "누가 먼저 말을 걸어줄 때까지 기다리는 편이다.", dimension: 'I' },
  { id: 13, text: "내 의견을 말로 설명하는 것이 글 쓰는 것보다 편하다.", dimension: 'E' },
  { id: 14, text: "내 생각을 글로 정리해서 보여주는 것이 더 정확하다.", dimension: 'I' },
  { id: 15, text: "활동적이고 시끄러운 환경에서도 집중을 잘한다.", dimension: 'E' },
  
  // S vs N (16-30)
  { id: 16, text: "이미 유행해서 검증된 간식 메뉴로 창업하고 싶다.", dimension: 'S' },
  { id: 17, text: "세상에 한 번도 없던 독특한 메뉴를 개발해보고 싶다.", dimension: 'N' },
  { id: 18, text: "수학이나 과학처럼 정답이 확실한 과목이 좋다.", dimension: 'S' },
  { id: 19, text: "국어나 미술처럼 상상력을 발휘하는 과목이 좋다.", dimension: 'N' },
  { id: 20, text: "물건을 사면 설명서를 꼼꼼히 읽고 그대로 따라 한다.", dimension: 'S' },
  { id: 21, text: "설명서 없이도 일단 이것저것 만져보며 작동법을 익힌다.", dimension: 'N' },
  { id: 22, text: "\"만약에~\"라는 가정보다 \"지금 당장\"의 현실이 중요하다.", dimension: 'S' },
  { id: 23, text: "엉뚱한 상상을 자주 하며 미래의 모습을 그려보곤 한다.", dimension: 'N' },
  { id: 24, text: "관찰력이 좋아서 친구들의 변화나 세부 사항을 잘 찾아낸다.", dimension: 'S' },
  { id: 25, text: "전체적인 분위기나 흐름을 파악하는 눈이 빠르다.", dimension: 'N' },
  { id: 26, text: "구체적인 사례나 데이터를 봐야 믿음이 간다.", dimension: 'S' },
  { id: 27, text: "아이디어의 비전이나 가능성만 보여도 가슴이 뛴다.", dimension: 'N' },
  { id: 28, text: "나는 꼼꼼하고 현실적이라는 말을 자주 듣는다.", dimension: 'S' },
  { id: 29, text: "나는 창의적이고 독특하다는 말을 자주 듣는다.", dimension: 'N' },
  { id: 30, text: "실생활에 바로 쓸 수 있는 도구를 만드는 게 좋다.", dimension: 'S' },

  // T vs F (31-45)
  { id: 31, text: "친구와 의견이 갈리면 '누구 말이 맞는지' 논리적으로 따진다.", dimension: 'T' },
  { id: 32, text: "친구와 의견이 갈리면 '서로 기분이 상하지 않게' 조절한다.", dimension: 'F' },
  { id: 33, text: "잘못한 친구에게는 따끔하게 충고를 해줘야 한다.", dimension: 'T' },
  { id: 34, text: "잘못한 친구라도 그럴만한 사정이 있었는지 먼저 묻는다.", dimension: 'F' },
  { id: 35, text: "조별 과제 잔혹사! 무임승차하는 친구는 점수를 깎아야 한다.", dimension: 'T' },
  { id: 36, text: "조금 부족한 친구라도 다 같이 끝까지 가는 게 중요하다.", dimension: 'F' },
  { id: 37, text: "비판적인 피드백을 들어도 \"나 잘 되라고 하는 소리구나\" 한다.", dimension: 'T' },
  { id: 38, text: "비판적인 피드백을 들으면 나를 싫어하나 싶어 속상하다.", dimension: 'F' },
  { id: 39, text: "규칙은 모두에게 공정하게 적용되어야 한다.", dimension: 'T' },
  { id: 40, text: "상황에 따라 예외를 인정해주는 따뜻함이 필요하다.", dimension: 'F' },
  { id: 41, text: "\"너 참 똑똑하다\"는 칭찬이 제일 기분 좋다.", dimension: 'T' },
  { id: 42, text: "\"너 참 착하다, 고마워\"라는 칭찬이 제일 기분 좋다.", dimension: 'F' },
  { id: 43, text: "감정보다는 사실과 결과가 더 중요하다.", dimension: 'T' },
  { id: 44, text: "결과보다는 과정에서 느낀 감정과 정성이 중요하다.", dimension: 'F' },
  { id: 45, text: "영화를 볼 때 스토리가 논리적인지 분석하며 본다.", dimension: 'T' }, // User provided (F) in prompt but contextually it's T

  // J vs P (46-60)
  { id: 46, text: "시험 기간에는 일주일 단위로 계획표를 짜야 한다.", dimension: 'J' },
  { id: 47, text: "시험 공부는 그때그때 내키는 과목부터 하는 게 효율적이다.", dimension: 'P' },
  { id: 48, text: "가방이나 책상이 항상 정돈되어 있어야 마음이 편하다.", dimension: 'J' },
  { id: 49, text: "조금 어질러져 있어도 내가 필요한 건 금방 찾는다.", dimension: 'P' },
  { id: 50, text: "약속 시간이 바뀌면 기분이 별로 안 좋다.", dimension: 'J' },
  { id: 51, text: "약속이 갑자기 취소되거나 바뀌어도 \"오히려 좋아!\" 한다.", dimension: 'P' },
  { id: 52, text: "숙제는 미리미리 끝내놓고 노는 편이다.", dimension: 'J' },
  { id: 53, text: "숙제는 미루다가 마감 직전에 초능력을 발휘해 끝낸다.", dimension: 'P' },
  { id: 54, text: "여행을 갈 때 분 단위로 일정을 짜는 게 즐겁다.", dimension: 'J' },
  { id: 55, text: "여행은 발길 닿는 대로 돌아다니는 게 진짜 여행이다.", dimension: 'P' },
  { id: 56, text: "결정을 내리기 전에 정보를 충분히 모아야 한다.", dimension: 'J' },
  { id: 57, text: "일단 시작해보고 문제가 생기면 그때 해결한다.", dimension: 'P' },
  { id: 58, text: "정해진 규칙이 있는 게임이나 운동이 좋다.", dimension: 'J' },
  { id: 59, text: "규칙이 유연하고 내 맘대로 할 수 있는 게임이 좋다.", dimension: 'P' },
  { id: 60, text: "철저하게 준비해야 성공 확률이 높다고 생각한다.", dimension: 'J' },
];

const RESULTS: Record<string, ResultData> = {
  ISTJ: {
    mbti: "ISTJ",
    description: "철저한 준비와 책임감으로 안정적인 시스템을 구축하는 창업가",
    items: ["무인 점포 관리 전문가", "데이터 라벨링 업체", "정밀 3D 출력 대행", "온라인 쇼핑몰 재고 관리 솔루션", "전문 서적 출판사"]
  },
  ISFJ: {
    mbti: "ISFJ",
    description: "세심한 배려와 성실함으로 고객의 마음을 사로잡는 창업가",
    items: ["반려동물 수제 간식 전문점", "커스텀 답례품 제작", "개인 맞춤형 학습 스케줄러 보급", "노인/아동 케어 서비스", "플라워 샵 운영"]
  },
  ESTJ: {
    mbti: "ESTJ",
    description: "탁월한 조직 관리 능력과 추진력으로 효율을 극대화하는 창업가",
    items: ["프랜차이즈 가맹 본부", "공유 오피스 매니징", "학교/기업 행사 총괄 대행", "물류 및 유통 시스템 창업", "전문 자격증 학원 운영"]
  },
  ESFJ: {
    mbti: "ESFJ",
    description: "친화력과 봉사 정신으로 지역 사회의 중심이 되는 창업가",
    items: ["로컬 커뮤니티 카페", "원데이 클래스 중개 플랫폼", "웨딩/파티 플래너", "사회 공헌 재단 운영", "고객 만족(CS) 컨설팅"]
  },
  ISTP: {
    mbti: "ISTP",
    description: "냉철한 분석력과 기술적 감각으로 문제를 해결하는 실무형 창업가",
    items: ["드론 커스텀 및 수리점", "PC/스마트폰 정비소", "목공/금속 공예 공방", "자전거/전동 킥보드 튜닝샵", "기계 부품 리사이클링"]
  },
  ISFP: {
    mbti: "ISFP",
    description: "독창적인 미적 감각과 자유로운 영혼을 담아내는 예술가형 창업가",
    items: ["캐릭터 굿즈 디자인 스튜디오", "인테리어 소품 쇼핑몰", "타이포그래피/로고 디자인", "컬러 테라피 샵", "독립 영상 제작소"]
  },
  ESTP: {
    mbti: "ESTP",
    description: "빠른 상황 판단과 넘치는 에너지로 기회를 포착하는 행동파 창업가",
    items: ["한정판 스니커즈 리셀 플랫폼", "스포츠 액티비티 기획", "푸드트럭 운영", "액션 카메라 대여 및 촬영 서비스", "중고차 거래 대행"]
  },
  ESFP: {
    mbti: "ESFP",
    description: "즐거움과 에너지를 전파하며 트렌드를 선도하는 엔터테이너 창업가",
    items: ["틱톡/릴스 콘텐츠 제작사", "이벤트 전문 MC 매니지먼트", "공연 기획 및 티켓팅 대행", "뷰티/패션 편집샵", "라이브 커머스 전문 호스트"]
  },
  INTJ: {
    mbti: "INTJ",
    description: "거시적인 안목과 전략적인 사고로 미래를 설계하는 혁신가형 창업가",
    items: ["AI 기반 학습 분석 서비스", "경영 전략 컨설팅 펌", "스마트 시티 보안 솔루션", "웹3.0/블록체인 기술 창업", "미래 기술 트렌드 연구소"]
  },
  INTP: {
    mbti: "INTP",
    description: "논리적인 추론과 지적 호기심으로 새로운 원리를 탐구하는 창업가",
    items: ["창의 보드게임 개발사", "코딩 교육용 교구 제작", "알고리즘 최적화 서비스", "전문 테크 리뷰어", "해커톤 기획 및 운영"]
  },
  ENTJ: {
    mbti: "ENTJ",
    description: "단호한 결단력과 강력한 리더십으로 목표를 달성하는 야망가형 창업가",
    items: ["IT 스타트업 창업(CEO)", "벤처 캐피탈(투자가)", "종합 광고 대행사", "에듀테크 플랫폼 개발", "글로벌 비즈니스 에이전시"]
  },
  ENTP: {
    mbti: "ENTP",
    description: "풍부한 상상력과 도전 정신으로 고정관념을 깨는 발명가형 창업가",
    items: ["신개념 공유 경제 플랫폼", "이색 체험 전시 기획", "무인 기술 솔루션 개발", "아이디어 경매 사이트", "마케팅 자동화 툴 개발"]
  },
  INFJ: {
    mbti: "INFJ",
    description: "깊은 통찰력과 가치 중심의 사고로 세상을 변화시키는 창업가",
    items: ["마음 치유 힐링 앱", "비건/친환경 브랜드", "사회적 기업 컨설팅", "예술 심리 치료 센터", "독립 서점"]
  },
  INFP: {
    mbti: "INFP",
    description: "따뜻한 감성과 확고한 신념으로 자신만의 색깔을 만드는 창업가",
    items: ["감성 에세이 독립 출판", "1인 문구 브랜드", "작곡 및 사운드 디자인", "일러스트레이터", "숲해설/생태 체험 서비스"]
  },
  ENFJ: {
    mbti: "ENFJ",
    description: "타인의 성장을 돕고 긍정적인 영향력을 전파하는 멘토형 창업가",
    items: ["스피치/리더십 아카데미", "청소년 진로 멘토링 기업", "비영리 단체(NGO)", "팀빌딩 프로그램 개발사", "다문화 가정 지원 서비스"]
  },
  ENFP: {
    mbti: "ENFP",
    description: "무한한 가능성을 발견하고 열정적으로 아이디어를 실현하는 창업가",
    items: ["이색 테마 여행사", "크리에이티브 콘텐츠 스튜디오", "반려동물 의류 디자이너", "팝업스토어 기획자", "스토리텔링 보드게임 제작"]
  }
};

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full bg-mars-surface h-3 rounded-sm overflow-hidden border border-mars-gold/20 p-[2px]">
    <motion.div 
      className="bg-mars-gold h-full shadow-[0_0_10px_rgba(255,184,0,0.5)]"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

const HudContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`hud-border bg-mars-surface/40 backdrop-blur-md p-8 md:p-12 mars-glow ${className}`}>
    <div className="hud-corners-bottom" />
    {children}
  </div>
);

import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

export default function App() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'loading' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleStart = () => {
    setStep('quiz');
    setCurrentIdx(0);
    setAnswers({});
    setAiRecommendation("");
  };

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIdx].id]: value }));
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => {
        setStep('result');
      }, 4200);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const calculateMBTI = useMemo(() => {
    if (Object.keys(answers).length < QUESTIONS.length) return "";

    const scores: Record<Dimension, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
    };

    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      scores[q.dimension] += answer;
    });

    const mbti = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P'
    ].join('');

    return mbti;
  }, [answers]);

  const result = calculateMBTI ? RESULTS[calculateMBTI] : null;

  const fetchAiRecommendation = async (mbti: string, items: string[]) => {
    if (!mbti || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `당신은 화성 테라포밍 프로젝트의 수석 창업 컨설턴트입니다. 사용자의 MBTI 유형은 ${mbti}이며, 기본 추천 아이템은 ${items.join(", ")}입니다. 
        이 유형의 강점을 분석하고, 화성이라는 특수한 환경에서 추천 아이템 중 하나를 골라 아주 구체적인 차별화 전략을 제안하거나, 
        화성 개척 시대에 어울리는 또 다른 이색적인 창업 아이템 2가지를 더 제안해주세요. 
        답변은 미래 지향적이고 전문적인 어조로 한국어로 작성해주시고, 마크다운 형식을 사용해 가독성 있게 구성해주세요.`,
      });
      setAiRecommendation(response.text || "데이터 수신에 실패했습니다.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiRecommendation("통신 장애가 발생했습니다. 기지국 연결을 확인해주세요.");
    } finally {
      setIsAiLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 'result' && result && !aiRecommendation) {
      fetchAiRecommendation(result.mbti, result.items);
    }
  }, [step, result]);

  return (
    <div className="min-h-screen font-sans selection:bg-mars-gold/30">
      <div className="star-field" />
      
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative inline-block"
                >
                  <div className="absolute inset-0 bg-mars-gold/20 blur-3xl rounded-full" />
                  <img 
                    src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop" 
                    alt="Mars" 
                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-mars-gold/30 relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="font-display text-mars-gold text-xl md:text-2xl tracking-[0.3em] uppercase">
                    Mars Terraforming
                  </h2>
                  <h1 className="font-display text-4xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                    퍼스트 <span className="text-mars-gold">벤처</span>
                  </h1>
                </div>
              </div>

              <HudContainer className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                  새로운 삶의 터전, 화성에서 AI를 활용한 MBTI 분석을 통해 성향을 파악하고, 
                  당신만의 <span className="text-mars-gold font-bold">창업 DNA</span>를 발견하여 
                  인류의 미래를 설계하는 퍼스트 벤처 캠프에 참여하세요.
                </p>
                
                <div className="pt-10">
                  <button 
                    onClick={handleStart}
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-display font-bold text-mars-dark transition-all duration-200 bg-mars-gold rounded-none hover:bg-white active:scale-95 text-xl tracking-widest"
                  >
                    MISSION START
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                  </button>
                </div>
              </HudContainer>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                {[
                  { icon: <Target />, label: "DNA TEST", sub: "성향 분석" },
                  { icon: <Brain />, label: "AI ANALYSIS", sub: "지능형 매칭" },
                  { icon: <Lightbulb />, label: "ITEM MATCH", sub: "아이템 추천" },
                  { icon: <Rocket />, label: "VENTURE", sub: "창업 실행" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4 border border-mars-gold/10 bg-mars-surface/20">
                    <div className="text-mars-gold">{item.icon}</div>
                    <div className="text-center">
                      <div className="font-display text-xs tracking-widest text-mars-gold">{item.label}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Copyright Notice - Embedded in Intro Background */}
              <div className="absolute bottom-0 right-0 md:-bottom-10 md:-right-10 opacity-40 pointer-events-none">
                <p className="font-display text-[15px] text-mars-gold tracking-widest uppercase text-right">
                  Copyright : Future Canvas & IDCo All Rights Reserved
                </p>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-10 max-w-3xl mx-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center font-display">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-mars-gold animate-pulse" />
                    <span className="text-mars-gold text-sm tracking-[0.2em] uppercase">
                      PORT-254 // SYSTEM SCANNING
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {currentIdx + 1} / {QUESTIONS.length}
                  </span>
                </div>
                <ProgressBar current={currentIdx + 1} total={QUESTIONS.length} />
              </div>

              <HudContainer className="min-h-[240px] flex flex-col justify-center">
                <div className="absolute top-4 left-4 font-display text-[10px] text-mars-gold/40">
                  DATA_INPUT_STREAM_00{currentIdx + 1}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight text-center">
                  {QUESTIONS[currentIdx].text}
                </h2>
              </HudContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "매우 그렇다", value: 4, color: "bg-mars-gold text-mars-dark" },
                  { label: "그런 편이다", value: 3, color: "border border-mars-gold/50 text-mars-gold hover:bg-mars-gold/10" },
                  { label: "그렇지 않다", value: 2, color: "border border-slate-700 text-slate-400 hover:bg-slate-800" },
                  { label: "전혀 아니다", value: 1, color: "bg-slate-800 text-slate-500" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`py-6 rounded-none font-display font-bold text-lg transition-all active:scale-[0.98] uppercase tracking-widest ${opt.color}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="flex items-center text-slate-500 hover:text-mars-gold disabled:opacity-0 transition-colors font-display text-xs tracking-widest"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  PREVIOUS_STEP
                </button>
                <div className="font-display text-[10px] text-slate-600">
                  MARS_SPACE_CENTER // FUTURE_CANVAS
                </div>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-16 py-20"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 border-t-2 border-b-2 border-mars-gold rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-mars-gold animate-pulse" size={48} />
                </div>
              </div>

              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-mars-gold tracking-widest uppercase text-glow">
                    AI 분석 중...
                  </h2>
                  <p className="text-slate-500 font-display text-xs tracking-widest">
                    GENETIC_ALGORITHM_SEQUENCING_IN_PROGRESS
                  </p>
                </div>

                <div className="relative inline-block font-display text-4xl md:text-6xl font-black tracking-tighter uppercase">
                  <span className="text-slate-800">MBTI 창업 분석</span>
                  <motion.span 
                    className="absolute top-0 left-0 text-mars-gold overflow-hidden whitespace-nowrap text-glow"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: "linear" }}
                  >
                    MBTI 창업 분석
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 pb-20"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-6 py-1 border border-mars-gold/30 text-mars-gold font-display text-xs tracking-[0.4em] uppercase">
                  Mission Assignment
                </div>
                <h2 className="text-6xl md:text-9xl font-display font-black text-white tracking-tighter text-glow">
                  {result.mbti}
                </h2>
                <p className="text-xl md:text-3xl font-display font-bold text-mars-gold uppercase tracking-tight">
                  {result.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Column: Basic Results */}
                <HudContainer className="space-y-10 flex flex-col">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-white">
                      <TrendingUp className="text-mars-gold" size={28} />
                      <h3 className="text-2xl font-display font-bold tracking-widest uppercase">추천 화성 벤처</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {result.items.map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-5 p-5 bg-mars-dark/50 border border-mars-gold/10 group hover:border-mars-gold/40 transition-all"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-mars-gold text-mars-dark flex items-center justify-center text-lg font-display font-black">
                            0{i + 1}
                          </div>
                          <span className="text-xl font-bold text-slate-200 group-hover:text-mars-gold transition-colors">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-mars-gold/10 mt-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <Users className="text-mars-gold" size={28} />
                      <h3 className="text-2xl font-display font-bold tracking-widest uppercase">DNA PROFILE</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "에너지", value: result.mbti[0] === 'E' ? "외향 (E)" : "내향 (I)" },
                        { label: "인식", value: result.mbti[1] === 'S' ? "감각 (S)" : "직관 (N)" },
                        { label: "판단", value: result.mbti[2] === 'T' ? "논리 (T)" : "감정 (F)" },
                        { label: "양식", value: result.mbti[3] === 'J' ? "계획 (J)" : "유연 (P)" },
                      ].map((trait, i) => (
                        <div key={i} className="p-4 bg-mars-gold/5 border border-mars-gold/10">
                          <p className="font-display text-[10px] text-mars-gold/60 uppercase tracking-widest mb-1">{trait.label}</p>
                          <p className="font-bold text-lg text-white">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </HudContainer>

                {/* Right Column: AI Assistant */}
                <div className="hud-border bg-mars-dark/80 backdrop-blur-xl p-8 md:p-12 mars-glow flex flex-col">
                  <div className="hud-corners-bottom" />
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-mars-gold rounded-none">
                      <Brain size={28} className="text-mars-dark" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-display font-bold tracking-widest uppercase text-mars-gold">AI MISSION ADVISOR</h3>
                      <p className="text-[10px] text-slate-500 font-display tracking-[0.2em]">TERRAFORMING_CONSULTANT_V3.1</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    {isAiLoading ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-6 py-12">
                        <div className="w-12 h-12 border-4 border-mars-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-mars-gold font-display text-xs tracking-widest animate-pulse">심층 전략 보고서 생성 중...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-mars max-w-none text-slate-300">
                        <Markdown>{aiRecommendation}</Markdown>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-slate-800 text-[10px] text-slate-600 font-display tracking-widest uppercase mt-6">
                    // MARS_VENTURE_INSIGHTS_GENERATED_BY_AI
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 items-center pt-10">
                <button 
                  onClick={handleStart}
                  className="w-full max-w-md py-5 bg-transparent border-2 border-mars-gold text-mars-gold font-display font-bold text-xl tracking-[0.3em] hover:bg-mars-gold hover:text-mars-dark transition-all active:scale-95 uppercase"
                >
                  REBOOT MISSION
                </button>
                <p className="text-slate-600 font-display text-[10px] tracking-widest uppercase text-center max-w-lg">
                  본 결과는 화성 거주 적합성 및 창업 성향 분석 데이터이며, 
                  실제 화성 이주 및 창업 시 참고용으로 활용하시기 바랍니다.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 184, 0, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 184, 0, 0.3);
        }
        .prose-mars h1, .prose-mars h2, .prose-mars h3 {
          color: var(--color-mars-gold);
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .prose-mars strong {
          color: var(--color-mars-gold);
        }
        .prose-mars ul li::marker {
          color: var(--color-mars-gold);
        }
      `}</style>
    </div>
  );
}
