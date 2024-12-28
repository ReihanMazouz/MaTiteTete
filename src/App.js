import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomeScreen = lazy(() => import('./components/HomeScreen'));
const QuizScreen = lazy(() => import('./components/QuizScreen'));
const LiseBooksScreen = lazy(() => import('./components/LiseBooksScreen'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route path="/quizz" element={<QuizScreen />} />
          <Route path="/lisebook" element={<LiseBooksScreen />} />
        </Routes>
      </Suspense>
    </Router>
  );
}