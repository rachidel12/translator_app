import React, { useState, useEffect } from 'react';
import {Form, TextArea, Button, Icon} from 'semantic-ui-react';
import axios from 'axios';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

const Translate = ()=>{
    const [inputText, setInputText] = useState('');
    const [detectLanguageKey, setdetectedLanguageKey] = useState('');
    const [languagesList, setLanguagesList] = useState([]);
    const [selectedLanguageKey, setLanguageKey] = useState('');
    const [resultText, setResultText] = useState('');
    const getLanguageSource = () => {
        axios.post("https://libretranslate.com/detect",{q:inputText})
        .then((response)=>{setdetectedLanguageKey(response.data[0].language)})
    }
    useEffect(()=>{
        axios.get("https://libretranslate.com/languages")
        .then((response)=>{setLanguagesList(response.data)})
        getLanguageSource()
    }, [inputText])
    const languageKey =(selectedLanguage) =>{
        setLanguageKey(selectedLanguage.target.value)
    }
    const translateText= () => {
        getLanguageSource();
        
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'API KEY',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            body: `[{"Text":"${inputText}"}]`
        };
        
        fetch(`https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${selectedLanguageKey}&api-version=3.0&profanityAction=NoAction&textType=plain`, options)
            .then(response => response.json())
            .then(response => setResultText(response[0].translations[0].text))
            .catch(err => console.error(err));
        }
        
    const { transcript, resetTranscript } = useSpeechRecognition({
        continuous: true
    }); 
    const speak = () => {
        const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(resultText);
        synth.speak(utterance);

        
    }
    let d =null;
    if (transcript) {
        d= <Form.Field control={TextArea} placeholder='Type your text...' onChange={(e) => setInputText(transcript)} value={transcript} />
    } else {
        d =  <Form.Field control={TextArea} placeholder='Type your text...' onChange={(e) => setInputText(e.target.value)}  />
    }

    return ( 
        <div className='part-all'>
            <div className="app-header">
            <img src="images/2022_FIFA_World_Cup.png" className='image-header' ></img>
                <h1 className="header">Translation</h1>
            </div>

            <div className="app-body">
                <div>
                    <Form>
                        <div all-part-speech>
                            {d}
                            <div className='part-speech'>
                                <button onClick={SpeechRecognition.startListening}><img src="images/start.png" width="30px" height="40"></img></button>
                                <button onClick={SpeechRecognition.stopListening}><img src="images/stop.png" width="30px" height="40"></img></button>
                                <button onClick={resetTranscript}><img src="images/reset.png" width="30px" height="40"></img></button>
                            </div>
                        </div>
                        
                        
                        <select className='language-select' onChange={languageKey}>
                            <option>Select Language</option>
                            {languagesList.map((language) => {
                                return (
                                    <option value={language.code}>{language.name}</option>
                                )
                            })}
                        </select>

                        <div className="part-result">
                            <Form.Field control={TextArea} placeholder='Here is your translation' value={resultText}/>
                            <div className='btn-sound'>
                                <Button onClick={speak}>
                                    <img src="images/sound.png" ></img>
                                </Button>
                            </div>
                        </div>
                        

                        <Button style={{background : '#0ba9ac', color:'white'}} size='large' onClick={translateText}>
                            <Icon name='translate' /> Translate
                        </Button>

                        

                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Translate;