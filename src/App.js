import React from 'react';
import './App.css';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

const deaultTargetLanguage = "fr";

class App extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            token: "",
            targetLanguage: deaultTargetLanguage,
            src: "",
            ogma: "",
            ogmaStartTime: 0,
            ogmaEndTime: 0,
            acs: "",
            acsStartTime: 0,
            acsEndTime: 0
        }
    }

    translate(useAcs) {
        if (useAcs) {
            this.setState({acs:""});
        } else {
            this.setState({ogma:""});
        }

        var req = new XMLHttpRequest();        
        req.onreadystatechange = function(){
            if(req.readyState === XMLHttpRequest.DONE) {
                
                if (useAcs)
                {
                    this.setState({acsEndTime: performance.now()});
                } else {
                    this.setState({ogmaEndTime: performance.now()});
                }

                if (req.status === 200) {
                    const translated = JSON.parse(req.responseText)[0].TranslatedText;
                    
                    if (useAcs) {                        
                        this.setState({acs:translated});
                    } else {                        
                        this.setState({ogma:translated});
                    }

                } else {

                    const error = "Error " + req.status;
                    if (useAcs) {                        
                        this.setState({acs:error});
                    } else {                        
                        this.setState({ogma:error});
                    }
                }
            }
        }.bind(this);

        req.open("POST", "https://outlook-sdf.office.com/ows/api/v1/translation/translateText?toLang=" + this.state.targetLanguage);
        req.setRequestHeader("Authorization", "Bearer " + this.state.token);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("x-translator-cid", "40343ab4-dfa0-66e5-4125-f53452e33cc1");
        req.setRequestHeader("x-translator-client-version", "20220712022");
        req.setRequestHeader("x-translator-cross-sid", "a348164e-96e8-df74-85d1-8ace48f6c26e");
        req.setRequestHeader("x-translator-scenario-type", 3);
        req.setRequestHeader("x-translator-sid","a348164e-96e8-df74-85d1-8ace48f6c26e");
        req.setRequestHeader("x-translator-trigger-type", 1);
        req.setRequestHeader("x-translator-user-id", "10033FFF801BC6C0");
        req.setRequestHeader("useacsapi", useAcs);
      
        const body = JSON.stringify([this.state.src]);

        if (useAcs)
        {
            this.setState({acsEndTime: 0})
            this.setState({acsStartTime: performance.now()});

        } else {
            this.setState({ogmaEndTime: 0})
            this.setState({ogmaStartTime: performance.now()});
        }
        req.send(body);
    }

    SyncScroll(){
        const originalView = document.getElementById('originalview');
        const ogmaView = document.getElementById('ogmaview');
        const acsView = document.getElementById('acsview');
        if (originalView != null && ogmaView != null && acsView != null) {
            ogmaView.scrollTop = originalView.scrollTop;
            acsView.scrollTop = originalView.scrollTop;
        }
    }

    render() {
        const ogmaLatency = this.state.ogmaEndTime > 0 ? "Latency: " + Number(this.state.ogmaEndTime - this.state.ogmaStartTime).toFixed(2) + " ms" : ""
        const acsLatency = this.state.acsEndTime > 0 ? "Latency: " + Number(this.state.acsEndTime - this.state.acsStartTime).toFixed(2) + " ms" : ""
        
        return  <ScrollSync>
            <div>
                <div className='tl'>
                    <div className='flow'>
                        <div className='labelcontainer'>Original Source</div>
                        <div className='frsource'>    
                            <textarea className='mytextarea' 
                                onChange={e => this.setState({src:e.target.value})}
                                placeholder='Paste email source here'/>
                        </div>
                        <div className='labelcontainer'>OWS Prime Access Token</div>
                        <div className='frtoken'>
                        <textarea className='mytextarea' 
                                onChange={e => this.setState({token:e.target.value})}
                                placeholder='Paste token here'/>
                        </div>
                        <div className='labelcontainer'>Target Language</div>
                        <div className='frlang'>
                        <textarea className='mytextarea' 
                                onChange={e => this.setState({targetLanguage:e.target.value})}
                                autoComplete='off'
                                autoCorrect='off'>
                            {deaultTargetLanguage}
                        </textarea>
                        </div>
                    </div>
                </div>
        
                <div className='tr'>
                    <div className='flow'>
                        <div className='labelcontainer'>Original</div>
                        <ScrollSyncPane>
                            <div className='froutput'>
                                <div dangerouslySetInnerHTML={{__html:this.state.src}}/>
                            </div>
                        </ScrollSyncPane>
                    </div>
                </div>
         
                <div className='bl'>
                    <div className='flow'>
                        <div className='labelcontainer'> 
                            <div className='mybutton' onClick={e => this.translate(false)}>
                                Translate with OGMA
                            </div>
                            <div className='label'>
                                {ogmaLatency}
                            </div>
                        </div>
                        <ScrollSyncPane>
                            <div className='froutput'>
                                <div dangerouslySetInnerHTML={{__html:this.state.ogma}}/>
                            </div>
                        </ScrollSyncPane>
                    </div>
                </div>
 
                <div className='br'>
                    <div className='flow'>
                        <div className='labelcontainer'> 
                            <div className='mybutton' onClick={e => this.translate(true)}>
                                Translate with ACS
                            </div>
                            <div className='label'>
                                {acsLatency}
                            </div>
                        </div>
                        <ScrollSyncPane>
                            <div id='acsview' className='froutput'>
                                <div dangerouslySetInnerHTML={{__html:this.state.acs}}/>
                            </div>
                        </ScrollSyncPane>
                    </div>
                </div>
            </div>
        </ScrollSync>;    
    }
}

export default App;