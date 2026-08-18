import { useEffect, useState } from 'react';
import {
  achievements,
  contacts,
  education,
  experienceData,
  profile,
  projectMix,
  projects,
  skills,
} from './data/resume.js';
import { useCounters } from './hooks/useCounters.js';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import Section from './components/Section.jsx';
import Achievements from './components/Achievements.jsx';
import AccordionList from './components/AccordionList.jsx';
import SkillTags from './components/SkillTags.jsx';
import ExperienceChart from './components/charts/ExperienceChart.jsx';
import ProjectMixChart from './components/charts/ProjectMixChart.jsx';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export default function App() {
  // 처음에는 OS 설정을 따르고, 이후에는 토글이 이긴다
  const [darkMode, setDarkMode] = useState(prefersDark);
  const { visitCount, likeCount, like, isConfigured, error } = useCounters();

  // tailwind darkMode:'class' 와 index.css의 .dark 토큰이 이 클래스를 본다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main className="max-w-3xl mx-auto px-6 pb-16 flex flex-col">
        <Hero
          profile={profile}
          contacts={contacts}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
        />

        <div className="pt-8">
          <StatsBar
            visitCount={visitCount}
            likeCount={likeCount}
            onLike={like}
            isConfigured={isConfigured}
            error={error}
          />
        </div>

        <Section id="achievements" title="주요 성과">
          <Achievements items={achievements} />
        </Section>

        <Section id="growth" title="연도별 성장 추이">
          <ExperienceChart data={experienceData} darkMode={darkMode} />
        </Section>

        <Section id="project-mix" title="프로젝트 경험 구성">
          <ProjectMixChart data={projectMix} darkMode={darkMode} />
        </Section>

        <Section id="education" title="교육 이수">
          <AccordionList items={education} columns={2} />
        </Section>

        <Section id="projects" title="프로젝트">
          <AccordionList items={projects} />
        </Section>

        <Section id="skills" title="기술">
          <SkillTags items={skills} />
        </Section>

        <footer className="py-10 text-center font-body text-sm text-faint">
          <p>React + Vite + Tailwind CSS로 제작</p>
          <p className="mt-1">AWS 배포: S3 + Lambda + DynamoDB</p>
        </footer>
      </main>
    </div>
  );
}
