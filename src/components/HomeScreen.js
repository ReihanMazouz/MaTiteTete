import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
  const [isSurfaceHovered, setIsSurfaceHovered] = useState(false);
  // const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false);
  const [isReadingButtonHovered, setIsReadingButtonHovered] = useState(false);

  const navigate = useNavigate();

  // const handlePlayPress = () => {
  //   navigate('/quizz');
  // };

  const handleReadingPress = () => {
    navigate('/lisebook');
  };

  return (
    <div className="container">
      <div
        className={`surface ${isSurfaceHovered ? 'surface-hovered' : ''}`}
        onMouseEnter={() => setIsSurfaceHovered(true)}
        onMouseLeave={() => setIsSurfaceHovered(false)}
      >
        <div className="scroll-content">
          <h1 className="title">Pour ma tite tête Lise</h1>
          <p className="subtitle">
            Voici ton application personnelle, à toi la plus vertueuse femme de mon existence et qui compte tant pour moi.
          </p>
          <p className="description">
            
          </p>

          {/* <button
            onClick={handlePlayPress}
            onMouseEnter={() => setIsPlayButtonHovered(true)}
            onMouseLeave={() => setIsPlayButtonHovered(false)}
            className={`play-button ${isPlayButtonHovered ? 'play-button-hovered' : ''}`}
          >
            Jouer
          </button> */}

          <button
            onClick={handleReadingPress}
            onMouseEnter={() => setIsReadingButtonHovered(true)}
            onMouseLeave={() => setIsReadingButtonHovered(false)}
            className={`play-button ${isReadingButtonHovered ? 'play-button-hovered' : ''}`}
          >
            C'est parti
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;