import React, { useContext, useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';

type Props = {};

const Authpage = (props: Props) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const api = useApi();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleSignin = async () => {
    const login = await api.authenticateUser(email, password); 
    
    if (email && password) {
        const isLogged = await auth.signin(email, password);
        if (isLogged) {
          navigate('/')
          setConfirm(true);
        } else {
            alert("Não funcionou!");
        }
      }
  } 

  return (
    <div className="auth-container">
        <div className="auth-login-text">
            <h3>Entrar com sua conta!</h3>
            <div className="inputText">
                <p>Digite seu email de autenticação</p>
                <input 
                    type="email" 
                    placeholder='Digite seu e-mail...'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="inputText">
                <p>Digite sua senha de autenticação válida</p>
                <input 
                    placeholder='Senha...'
                    value={password}
                    type='password'
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="buttonConfirm">
                <button type='submit' onClick={handleSignin}>Entrar</button>
            </div>
        </div>

    </div>
  );
};

export default Authpage;
