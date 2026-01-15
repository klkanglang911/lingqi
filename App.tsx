import React, { useState } from 'react';
import { TabBar } from './components/TabBar';
import { Screen } from './types';
import { Home } from './pages/Home';
import { Ritual } from './pages/Ritual';
import { Result } from './pages/Result';
import { Detail } from './pages/Detail';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { Culture } from './pages/Culture';
import { CultureDetail } from './pages/CultureDetail';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.HOME);
  const [selectedDetailId, setSelectedDetailId] = useState<string>('12');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('origin');

  const navigate = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.HOME:
        return <Home onNavigate={navigate} />;
      case Screen.RITUAL:
        return <Ritual onNavigate={navigate} />;
      case Screen.RESULT:
        return <Result onNavigate={navigate} setDetailId={setSelectedDetailId} />;
      case Screen.DETAIL:
        return <Detail onNavigate={navigate} id={selectedDetailId} />;
      case Screen.PROFILE:
        return <Profile onNavigate={navigate} />;
      case Screen.HISTORY:
        return <History onNavigate={navigate} setDetailId={setSelectedDetailId} />;
      case Screen.CULTURE:
        return <Culture onNavigate={navigate} setArticleId={setSelectedArticleId} />;
      case Screen.CULTURE_DETAIL:
        return <CultureDetail onNavigate={navigate} id={selectedArticleId} />;
      // Fallbacks for other screens in a real app
      case Screen.SETTINGS:
      case Screen.FEEDBACK:
      case Screen.COLLECTION:
        return <Profile onNavigate={navigate} />; // Placeholder
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  const showTabBar = [Screen.PROFILE, Screen.HISTORY, Screen.CULTURE, Screen.SETTINGS, Screen.FEEDBACK, Screen.COLLECTION, Screen.RESULT].includes(screen);

  return (
    <div className="h-full w-full bg-background-dark text-white font-sans flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl relative">
      {renderScreen()}
      {showTabBar && <TabBar currentScreen={screen} onNavigate={navigate} />}
    </div>
  );
}