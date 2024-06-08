import React from 'react';
import CallList from '../CallList/CallList';
import './App.scss';

const App: React.FC = () => {
    return (
        <div className='container'>
            <CallList />
        </div>
    );
};

export default App;