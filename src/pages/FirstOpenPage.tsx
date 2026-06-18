import { useMemo, useState } from "react";
import {
  firstOpenWeatherOptions,
  type FirstOpenWeatherId
} from "../data/firstOpenScene";

export function FirstOpenPage() {
  const [selectedWeatherId, setSelectedWeatherId] = useState<FirstOpenWeatherId>("storm");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const selectedWeather = useMemo(
    () =>
      firstOpenWeatherOptions.find((option) => option.id === selectedWeatherId) ??
      firstOpenWeatherOptions[0],
    [selectedWeatherId]
  );
  const canContinue = Boolean(selectedTag);

  const handleWeatherChange = (weatherId: FirstOpenWeatherId) => {
    setSelectedWeatherId(weatherId);
    setSelectedTag(null);
  };

  return (
    <main className="app-shell first-open-shell">
      <header className="first-open-hero">
        <div className="first-open-hero__copy">
          <p className="hero-kicker">首次进入</p>
          <h1>小情绪房间</h1>
          <p className="hero-subtitle">
            如果一时还说不清，就先选一个最像你现在的内心天气。
          </p>
        </div>
        <p className="first-open-hero__support">
          再点一个最像你现在会说出口的词，我们慢慢从这里开始。
        </p>
      </header>

      <section className="first-open-layout">
        <section className="first-open-stage">
          <img
            className="first-open-stage__image"
            src="/emotion-scenes/1.png"
            alt="首开情绪汇报场景图"
          />

          <div className="first-open-stage__overlay">
            <span className="first-open-stage__badge">首开场景</span>
            <p className="first-open-stage__line">你来就好，慢一点也没关系。</p>
            <p className="first-open-stage__hint">
              现在像是 {selectedWeather.weatherLabel}：{selectedWeather.weatherHint}
            </p>
          </div>
        </section>

        <aside className="first-open-card">
          <section className="first-open-card__section">
            <p className="first-open-card__eyebrow">第 1 步</p>
            <h2>先用内心天气碰一下现在的自己</h2>
            <p className="first-open-card__copy">
              先选 1 个内心天气，再选 1 个最像你此刻的话。不用急着讲明白，先靠近现在的感觉就好。
            </p>
          </section>

          <section className="first-open-card__section">
            <p className="first-open-card__label">内心天气</p>
            <div className="first-open-card__weather-grid">
              {firstOpenWeatherOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="first-open-card__choice"
                  data-active={option.id === selectedWeatherId}
                  aria-pressed={option.id === selectedWeatherId}
                  onClick={() => handleWeatherChange(option.id)}
                >
                  {option.weatherLabel}
                </button>
              ))}
            </div>
          </section>

          <section className="first-open-card__section">
            <p className="first-open-card__label">现在最像哪一句</p>
            <div className="first-open-card__tag-grid">
              {selectedWeather.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="first-open-card__choice first-open-card__choice--tag"
                  data-active={tag === selectedTag}
                  aria-pressed={tag === selectedTag}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="first-open-card__footer">
            <p className="first-open-card__selection">
              {selectedTag
                ? `已选择：${selectedWeather.weatherLabel} / ${selectedTag}`
                : "选 1 个最像的话，我们就从这里继续。"}
            </p>

            <button type="button" className="first-open-card__continue" disabled={!canContinue}>
              继续
            </button>
          </section>
        </aside>
      </section>
    </main>
  );
}
