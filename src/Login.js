import React, { useState } from 'react';
import { login } from './api'; // api.js 경로에 맞게 조정하세요

const Login = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await login(id, pw);
            if (response.status === 201) {
                // 로그인 성공 처리
                setMessage(`Welcome, ${response.data.name}!`);
                // 토큰 저장 및 사용자 리다이렉트 등 추가 작업
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            setMessage('Login failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        학번:
                        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        비밀번호:
                        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
                    </label>
                </div>
                <button type="submit">로그인</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
