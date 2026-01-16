
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ASSETS, COLORS, WISHES } from './constants';

// Declare external global for AOS and Confetti
declare const AOS: any;
declare const confetti: any;

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  image: string;
  delay: number;
  duration: number;
}

const App: React.FC = () => {
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isExiting, setIsExiting] = useState(false);
  const [clickedCategories, setClickedCategories] = useState<Set<string>>(new Set());
  const [currentWish, setCurrentWish] = useState<string | null>(null);

  // 1. Khởi tạo danh sách item trang trí cố định (Persistent) bằng useMemo
  const floatingItemsConfig = useMemo(() => {
    const items: FloatingItem[] = [];
    for (let i = 0; i < 7; i++) {
      items.push({
        id: i,
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: Math.random() * (120 - 40) + 40,
        image: Math.random() > 0.5 ? ASSETS.item1 : ASSETS.item2,
        delay: Math.random() * 5,
        duration: Math.random() * (8 - 4) + 4,
      });
    }
    return items;
  }, []);

  // 2. Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 900, 
      once: false,
      offset: 0,
      easing: 'ease-out-back',
    });
  }, []);

  // 3. Refresh AOS khi nội dung thay đổi
  useEffect(() => {
    if (AOS) {
      setTimeout(() => {
        AOS.refreshHard();
      }, 1000);
    }
  }, [scene, currentWish]);

  // 4. Hàm chuyển cảnh mượt mà (chỉ fade-out nội dung bên trong)
  const changeScene = useCallback((newScene: 1 | 2 | 3 | 4 | 5) => {
    setIsExiting(true);
    setTimeout(() => {
      setScene(newScene);
      setIsExiting(false);
      setCurrentWish(null);
    }, 900); 
  }, []);

  const handleCategoryClick = (category: 'self' | 'health' | 'career') => {
    setClickedCategories(prev => new Set(prev).add(category));
    setCurrentWish(WISHES[category]);
  };

  const handleBackToScene2 = () => {
    setCurrentWish(null);
  };

  const handleGoToScene3 = () => {
    changeScene(3);
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200); 
  };

  const handleGoToScene4 = () => {
    changeScene(4);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.5 }
      });
    }, 1200);
  };

  const handleGoToScene5 = () => {
    changeScene(5);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* LAYER NỀN CỐ ĐỊNH TUYỆT ĐỐI (KHÔNG THAY ĐỔI THEO SCENE) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ASSETS.background})` }}
      />
      <div className="fixed inset-0 z-5 bg-black/40 pointer-events-none" />

      {/* LAYER ITEMS TRANG TRÍ CỐ ĐỊNH TUYỆT ĐỐI (KHÔNG THAY ĐỔI THEO SCENE) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {floatingItemsConfig.map(item => (
          <div
            key={item.id}
            className="absolute animate-floating"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.size}px`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              opacity: 0.6,
            }}
          >
            <img src={item.image} alt="" className="w-full h-auto object-contain" />
          </div>
        ))}
      </div>

      {/* Persistent Gift Decoration (Cố định cho các Scene cuối) */}
      {[3, 4, 5].includes(scene) && (
        <div 
          className="fixed pointer-events-none z-20 animate-gift-pingpong"
          style={{ width: '10vw', minWidth: '80px' }}
        >
          <img src={ASSETS.gift} alt="" className="w-full h-auto object-contain opacity-90" />
        </div>
      )}

      {/* KHỐI NỘI DUNG CHÍNH (LAYER DUY NHẤT THỰC HIỆN FADE KHI CHUYỂN SCENE) */}
      <div className={`relative z-30 w-full min-h-screen flex items-center justify-center px-4 py-10 transition-all duration-900 ${isExiting ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
        
        {/* SCENE 1 */}
        {scene === 1 && (
          <div className="flex flex-col items-center space-y-8 max-w-full text-center">
            <div data-aos="zoom-in" data-aos-duration="900" data-aos-delay="300">
               <img src={ASSETS.scene1Main} alt="Béo" className="h-[70vh] w-auto max-w-[90vw] object-contain" />
            </div>
            <button 
              data-aos="zoom-in" data-aos-duration="900" data-aos-delay="900"
              onClick={() => changeScene(2)}
              className="px-10 py-5 rounded-full text-2xl font-bold transform transition hover:scale-110 active:scale-95 shadow-lg"
              style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
            >
              Lời yêu thương gửi Béo
            </button>
          </div>
        )}

        {/* SCENE 2 */}
        {scene === 2 && (
          <div className="flex flex-col items-center w-full max-w-6xl text-center">
            {!currentWish ? (
              <div className="flex flex-col items-center space-y-8 md:space-y-12 w-full">
                <h2 data-aos="zoom-in" data-aos-duration="900" className="text-3xl md:text-5xl font-extrabold px-4" style={{ color: COLORS.main }}>
                  Tình yêu to bự chọn những lời chúc sau nhé
                </h2>
                <div className="flex flex-nowrap justify-center gap-8 w-full px-2 items-center overflow-x-auto scrollbar-hide py-4">
                  <CategoryButton id="self" image={ASSETS.catSelf} isClicked={clickedCategories.has('self')} onClick={() => handleCategoryClick('self')} delay={0} />
                  <CategoryButton id="health" image={ASSETS.catHealth} isClicked={clickedCategories.has('health')} onClick={() => handleCategoryClick('health')} delay={300} />
                  <CategoryButton id="career" image={ASSETS.catCareer} isClicked={clickedCategories.has('career')} onClick={() => handleCategoryClick('career')} delay={600} />
                </div>
                {clickedCategories.size === 3 && (
                  <div data-aos="zoom-in" data-aos-duration="900" className="mt-8 space-y-6 flex flex-col items-center">
                    <p className="text-xl md:text-2xl font-bold px-4" style={{ color: COLORS.third }}>Hehe vẫn chưa hết đâu, xem tiếp nha</p>
                    <button 
                      onClick={handleGoToScene3} 
                      className="px-12 py-5 rounded-full text-2xl font-bold transition-all transform hover:scale-110 shadow-lg"
                      style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
                    >
                      Xem tiếp
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div data-aos="zoom-in" data-aos-duration="900" className="p-10 md:p-14 rounded-3xl max-w-4xl mx-auto backdrop-blur-md shadow-2xl mb-12" style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
                  <p className="font-wish leading-relaxed" style={{ color: COLORS.main }}>"{currentWish}"</p>
                </div>
                <button 
                  data-aos="fade-up" 
                  onClick={handleBackToScene2} 
                  className="px-10 py-4 rounded-full font-bold transition-all transform hover:scale-110 text-xl shadow-lg" 
                  style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
                >
                   Xem tiếp
                </button>
              </div>
            )}
          </div>
        )}

        {/* SCENE 3 */}
        {scene === 3 && (
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl w-full">
            <div data-aos="fade-down" data-aos-duration="900"><img src={ASSETS.titleFinal} alt="" className="w-auto h-32 md:h-48 max-w-[90vw] object-contain" /></div>
            <div data-aos="zoom-in" data-aos-duration="900"><img src={ASSETS.finalPhoto} alt="" className="w-auto h-auto max-w-[85vw] max-h-[50vh] md:max-w-xl rounded-3xl shadow-none" /></div>
            <div data-aos="zoom-in" data-aos-duration="900" className="space-y-8 px-4">
              <p className="font-wish max-w-3xl mx-auto" style={{ color: COLORS.main }}>
                Tình yêu bé bỏng của B luôn vui, an nhiên, hạnh phúc nha. Mình vẫn luôn ở đây để tình yêu có thể chia sẻ bất cứ lúc nào những tâm sự vui buồn trong cuộc sống. Thương Béo nhiều nhiều lắm. Ôm và hun Béo nhiều ❤️ ❤️ ❤️ 
              </p>
              <p className="text-xl md:text-2xl italic opacity-90 font-light" style={{ color: COLORS.main }}>- From Bon with luv  ❤️💌💗 -</p>
            </div>
            <button 
              onClick={handleGoToScene4} 
              className="mt-10 px-12 py-4 rounded-full font-bold transition hover:scale-105 active:scale-95 text-xl shadow-lg" 
              style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
            >
             Béo thấy thú vị 🤩 ,  xem lại nhó!
            </button>
          </div>
        )}

        {/* SCENE 4 */}
        {scene === 4 && (
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl px-4 w-full">
            <h1 data-aos="zoom-in" className="text-7xl md:text-9xl font-black italic tracking-tighter" style={{ color: COLORS.third, textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>SURPRISE 😝</h1>
            <div data-aos="fade-up" data-aos-delay="300" className="p-8 md:p-12 rounded-[40px] backdrop-blur-md border border-white/10 shadow-2xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
              <p className="text-xl md:text-3xl font-medium leading-relaxed" style={{ color: COLORS.main }}>
                P/s: Hy vọng hôm nay chị em làm thật nhanh, meeting ít hoặc ko có để có thể kết thúc sớm công việc, enjoy ngày sinh nhật aka tối thứ sáu toẹt vời cùng with bạn Mia nha!
              </p>
            </div>
            <button 
              onClick={handleGoToScene5} 
              className="px-14 py-5 rounded-full text-2xl font-bold hover:scale-110 shadow-lg" 
              style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
            >
              Xem lại nhó 🤪
            </button>
          </div>
        )}

        {/* SCENE 5 */}
        {scene === 5 && (
          <div className="flex flex-col items-center text-center space-y-12 max-w-5xl px-4 w-full h-full justify-center">
            <div className="space-y-6">
              <p data-aos="fade-down" className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.main }}>Úi! Quên mất, sinh nhật là phải thổi nến nữa mới đúng bài</p>
              <p data-aos="fade-down" data-aos-delay="1000" className="text-xl md:text-3xl italic opacity-90" style={{ color: COLORS.third }}>Bánh kem đến đây, tình yêu thổi nến online nha</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="2000" className="max-w-md w-full">
              <img src={ASSETS.cake} alt="Cake" className="w-full h-auto drop-shadow-[0_0_30px_rgba(234,138,104,0.4)]" />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <button 
                data-aos="zoom-in" 
                data-aos-delay="7000" 
                onClick={handleReload} 
                className="px-14 py-5 rounded-full text-2xl font-bold hover:scale-110 shadow-lg" 
                style={{ backgroundColor: COLORS.secondary2, color: COLORS.buttonText }}
              >
                Xem lại nhó
              </button>
              <p 
                data-aos="fade-up" 
                data-aos-delay="7500" 
                className="text-sm md:text-base opacity-70 italic font-light" 
                style={{ color: COLORS.main }}
              >
                Lần này là hết thật rồi ahihihi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CategoryButtonProps {
  id: string;
  image: string;
  isClicked: boolean;
  onClick: () => void;
  delay?: number;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ image, isClicked, onClick, delay = 0 }) => {
  return (
    <div data-aos="zoom-out" data-aos-duration="900" data-aos-delay={delay} className="flex flex-col items-center cursor-pointer group shrink-0" onClick={onClick}>
      <div className={`relative h-[150px] md:h-[250px] w-auto transition-all duration-500 ${isClicked ? 'scale-90 brightness-50 grayscale-[0.5]' : 'group-hover:scale-110'}`}>
        <img src={image} alt="" className="h-full w-auto object-contain" />
      </div>
    </div>
  );
};

export default App;
