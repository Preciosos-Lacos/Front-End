import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RequireAuthModal({ show, message }) {
  const navigate = useNavigate();
  if (!show) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div style={{background:'#fff',padding:32,borderRadius:8,minWidth:320,textAlign:'center'}}>
        <h2>Você precisa estar logado!</h2>
        <p>{message || 'Faça login para acessar esta página.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Ir para Login</button>
      </div>
    </div>
  );
}
