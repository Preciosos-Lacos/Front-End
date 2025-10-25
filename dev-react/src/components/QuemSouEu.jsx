import React from 'react';
import '../styles/QuemSouEu.css';
import camila from '../assets/camila_osterman.jpg';

const QuemSouEu = () => {
  return (
    <div className="sessao-quem-sou-eu">
      <section className="quem-sou-eu">
        <h2>Quem sou eu?</h2>
        <div className="sobre">
          <p>
            “Comecei com um sonho e alguns laços. Quero crescer, alcançar mais pessoas e transformar minha marca em
            referência. Com dedicação e carinho, sei que meu pequeno negócio pode se tornar uma grande empresa!“
            <br /><br />
            <strong>Camila Osterman</strong>, dona da Preciosos Laços.
          </p>
          <img src={camila} alt="Camila Osterman" />
        </div>
      </section>
    </div>
  );
};

export default QuemSouEu;
