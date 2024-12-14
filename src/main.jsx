import React, { useState, useEffect } from 'react';
    import ReactDOM from 'react-dom';

    const animals = [
      "Dog", "Cat", "Elephant", "Lion", "Tiger", "Bear", "Giraffe", "Zebra", "Kangaroo", "Penguin",
      // Add more animals here...
      "Dolphin", "Shark", "Octopus", "Spider", "Ant", "Beetle", "Butterfly", "Dragonfly", "Frog", "Toad"
    ];

    const CharadesGame = () => {
      const [selectedAnimals, setSelectedAnimals] = useState([]);
      const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
      const [score, setScore] = useState(0);
      const [timer, setTimer] = useState(60);
      const [isGameRunning, setIsGameRunning] = useState(false);
      const [gotItAnimals, setGotItAnimals] = useState([]);
      const [skippedAnimals, setSkippedAnimals] = useState([]);

      useEffect(() => {
        setSelectedAnimals(shuffleArray(animals).slice(0, 10));
      }, []);

      useEffect(() => {
        let interval;
        if (isGameRunning && timer > 0) {
          interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);
        } else if (timer === 0) {
          clearInterval(interval);
          setIsGameRunning(false);
        }
        return () => clearInterval(interval);
      }, [isGameRunning, timer]);

      const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const handleGotItClick = () => {
        if (isGameRunning) {
          setScore(prevScore => prevScore + 1);
          setGotItAnimals(prevGotItAnimals => [...prevGotItAnimals, selectedAnimals[currentAnimalIndex]]);
          setCurrentAnimalIndex(prevIndex => prevIndex + 1);
        }
      };

      const handleSkipClick = () => {
        if (isGameRunning) {
          setSkippedAnimals(prevSkippedAnimals => [...prevSkippedAnimals, selectedAnimals[currentAnimalIndex]]);
          setCurrentAnimalIndex(prevIndex => prevIndex + 1);
        }
      };

      const handleStartClick = () => {
        setIsGameRunning(true);
        setTimer(60);
        setScore(0);
        setCurrentAnimalIndex(0);
        setGotItAnimals([]);
        setSkippedAnimals([]);
      };

      const handleRestartClick = () => {
        setSelectedAnimals(shuffleArray(animals).slice(0, 10));
        setIsGameRunning(false);
        setTimer(60);
        setScore(0);
        setCurrentAnimalIndex(0);
        setGotItAnimals([]);
        setSkippedAnimals([]);
      };

      const handleRetrySkipClick = (animal) => {
        if (isGameRunning) {
          const index = selectedAnimals.indexOf(animal);
          if (index !== -1) {
            setCurrentAnimalIndex(index);
            setSkippedAnimals(prevSkippedAnimals => prevSkippedAnimals.filter(a => a !== animal));
          }
        }
      };

      return (
        <div className="game-container">
          <h1>Charades Game</h1>
          <div className="display-box">
            {selectedAnimals.length > 0 && selectedAnimals[currentAnimalIndex]}
          </div>
          <div className="button-container">
            <button onClick={handleGotItClick} disabled={!isGameRunning}>Got it</button>
            <button onClick={handleSkipClick} disabled={!isGameRunning}>Skip</button>
            <button onClick={handleStartClick} disabled={isGameRunning}>Start</button>
            <button onClick={handleRestartClick}>Restart</button>
          </div>
          {timer > 0 && isGameRunning && (
            <div className="timer">Time: {timer}s</div>
          )}
          {timer === 0 && (
            <div className="score">
              <h2>Score: {score}</h2>
              <div>
                <strong>Got it:</strong> {gotItAnimals.join(', ')}
              </div>
              <div>
                <strong>Skipped:</strong> {skippedAnimals.map(animal => (
                  <span key={animal} onClick={() => handleRetrySkipClick(animal)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {animal}
                  </span>
                )).join(', ')}
              </div>
              <div>
                <strong>Not Answered:</strong> {selectedAnimals.filter(animal => !gotItAnimals.includes(animal) && !skippedAnimals.includes(animal)).join(', ')}
              </div>
            </div>
          )}
        </div>
      );
    };

    ReactDOM.render(<CharadesGame />, document.getElementById('root'));
