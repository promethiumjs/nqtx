let $15882dbcd04d9f27$var$currentEntity,$15882dbcd04d9f27$var$getCurrentStoreMethod,$15882dbcd04d9f27$var$getCurrentStoreIdMethod,$15882dbcd04d9f27$var$renderComponentMethod,$15882dbcd04d9f27$var$getPreventMultipleRendersMethod,$15882dbcd04d9f27$var$setPreventMultipleRendersMethod;function $15882dbcd04d9f27$export$33b9e1ccb5643ac8(entity){$15882dbcd04d9f27$var$currentEntity=entity}function $15882dbcd04d9f27$export$5676a8a1d49c85be(){return $15882dbcd04d9f27$var$currentEntity}function $15882dbcd04d9f27$export$9d75f3e1a7e94aee(storeId){return $15882dbcd04d9f27$var$getCurrentStoreMethod(storeId)}function $15882dbcd04d9f27$export$9e78cbb868ddafad(){return $15882dbcd04d9f27$var$getCurrentStoreIdMethod()}function $15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId){$15882dbcd04d9f27$var$renderComponentMethod(storeId)}function $15882dbcd04d9f27$export$e7f1d62916683ee7(){return $15882dbcd04d9f27$var$getPreventMultipleRendersMethod}function $15882dbcd04d9f27$export$743647d42396ef87(boolean){$15882dbcd04d9f27$var$setPreventMultipleRendersMethod(boolean)}function $15882dbcd04d9f27$export$6ceec5925def9744({getCurrentStore:getCurrentStore,getCurrentStoreId:getCurrentStoreId,renderComponent:renderComponent,getPreventMultipleRenders:getPreventMultipleRenders,setPreventMultipleRenders:setPreventMultipleRenders}){$15882dbcd04d9f27$var$getCurrentStoreMethod=getCurrentStore,$15882dbcd04d9f27$var$getCurrentStoreIdMethod=getCurrentStoreId,$15882dbcd04d9f27$var$renderComponentMethod=renderComponent,$15882dbcd04d9f27$var$getPreventMultipleRendersMethod=getPreventMultipleRenders,$15882dbcd04d9f27$var$setPreventMultipleRendersMethod=setPreventMultipleRenders}class $97020ee417fa4c70$export$2e2bcd8739ae039{constructor(initialParticleStates={}){this.particles={states:initialParticleStates,mutators:{},derivativeSubs:{},componentSubs:{},otherSubs:{}},this._particles={},this.derivatives={states:{},transforms:{},particleSubs:{},componentSubs:{},otherSubs:{}},this._derivatives={},this.triggers={subscriptions:{}},this._triggers={}}static create(initialParticleStates1){const entity=new $97020ee417fa4c70$export$2e2bcd8739ae039(initialParticleStates1);return $15882dbcd04d9f27$export$33b9e1ccb5643ac8(entity),entity}addAdaptationMethods(methods){$15882dbcd04d9f27$export$6ceec5925def9744(methods)}set({particleId:particleId2,newState:newState1}){const _particle=this._particles[particleId2],states=this.particles.states,derivativeSubs=this.particles.derivativeSubs,componentSubs=this.particles.componentSubs,otherSubs=this.particles.otherSubs;_particle.state=newState1,states[particleId2]=newState1,$15882dbcd04d9f27$export$743647d42396ef87(!0),derivativeSubs[particleId2]&&derivativeSubs[particleId2].forEach((derivativeId=>this.update({derivativeId:derivativeId}))),componentSubs[particleId2]&&componentSubs[particleId2].forEach((storeId=>$15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId))),otherSubs[particleId2]&&setTimeout((()=>otherSubs[particleId2].forEach((listener=>listener(newState1))))),$15882dbcd04d9f27$export$743647d42396ef87(!1)}get({particleId:particleId1,derivativeId:derivativeId,firstTime:firstTime}){const states=this.particles.states;if(firstTime){const derivativeSubs=this.particles.derivativeSubs;derivativeSubs[particleId1]||(derivativeSubs[particleId1]=[]),derivativeSubs[particleId1].push(derivativeId);const particleSubs=this.derivatives.particleSubs,unsubscribe=()=>{try{const index=derivativeSubs[particleId1].indexOf(derivativeId);derivativeSubs[particleId1].splice(index,1)}catch(err){}};particleSubs[derivativeId]||(particleSubs[derivativeId]=[]),particleSubs[derivativeId].push(unsubscribe)}return states[particleId1]}update({derivativeId:derivativeId1}){const _derivative=this._derivatives[derivativeId1],states=this.derivatives.states,transforms=this.derivatives.transforms,componentSubs=this.derivatives.componentSubs,otherSubs=this.derivatives.otherSubs;let newState;try{newState=transforms[derivativeId1]({get:particleId=>this.get({particleId:particleId,derivativeId:derivativeId1})})}catch(err){newState=null}_derivative.state=newState,states[derivativeId1]=newState,componentSubs[derivativeId1]&&componentSubs[derivativeId1].forEach((storeId=>$15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId))),otherSubs[derivativeId1]&&setTimeout((()=>otherSubs[derivativeId1].forEach((listener=>listener(newState)))))}getParticleStates(){return this.particles.states}getDerivativeStates(){return this.derivatives.states}getParticle({id:id,storeId:storeId}){if(!this._particles[id]){const surrogate={state:null,getState:()=>{},mutate:()=>{},set:()=>{},subscribe:()=>{},detonate:()=>{},unavailable:!0};return storeId?[surrogate,null]:surrogate}if(storeId){const componentSubs=this.particles.componentSubs;componentSubs[id]||(componentSubs[id]=[]),componentSubs[id].push(storeId);const unsubscribe=()=>{try{const index=componentSubs[id].indexOf(storeId);componentSubs[id].splice(index,1)}catch(err){}};return[this._particles[id],unsubscribe]}return this._particles[id]}setParticle({id:id1,initialState:initialState,mutator:mutator}){const states=this.particles.states,mutators=this.particles.mutators,derivativeSubs=this.particles.derivativeSubs,componentSubs=this.particles.componentSubs,otherSubs=this.particles.otherSubs;void 0!==initialState&&(states[id1]=initialState),mutator&&(mutators[id1]=mutator),this._particles[id1]={state:states[id1],getState:()=>states[id1],mutate:(mutation,payload)=>{this.set({particleId:id1,newState:mutators[id1][mutation]({state:states[id1],payload:payload})})},set:newState=>this.set({particleId:id1,newState:newState}),subscribe:listener=>(otherSubs[id1]||(otherSubs[id1]=[]),otherSubs[id1].push(listener),()=>{const index=otherSubs[id1].indexOf(listener);otherSubs[id1].splice(index,1)}),detonate:()=>{this._particles[id1].state=null,this._particles[id1].getState=null,this._particles[id1].mutate=null,this._particles[id1].set=null,this._particles[id1].subscribe=null,this._particles[id1].detonate=null,delete this._particles[id1],delete states[id1],delete mutators[id1],delete derivativeSubs[id1],delete componentSubs[id1],delete otherSubs[id1]}}}particle({id:id2,initialState:initialState1,mutator:mutator1,overwrite:overwrite}){if(this._particles[id2])return this.getParticle({id:id2});const states=this.particles.states;return states[id2]&&states[id2]&&!overwrite?this.setParticle({id:id2,mutator:mutator1}):this.setParticle({id:id2,initialState:initialState1,mutator:mutator1}),this.getParticle({id:id2})}getDerivative({id:id3,storeId:storeId1}){if(!this._derivatives[id3]){const surrogate={state:null,getState:()=>{},subscribe:()=>{},detonate:()=>{},unavailable:!0};return storeId1?[surrogate,null]:surrogate}if(storeId1){const componentSubs=this.derivatives.componentSubs;componentSubs[id3]||(componentSubs[id3]=[]),componentSubs[id3].push(storeId1);const unsubscribe=()=>{try{const index=componentSubs[id3].indexOf(storeId1);componentSubs[id3].splice(index,1)}catch(err){}};return[this._derivatives[id3],unsubscribe]}return this._derivatives[id3]}setDerivative({id:id4,transform:transform}){const states=this.derivatives.states,transforms=this.derivatives.transforms,particleSubs=this.derivatives.particleSubs,componentSubs=this.derivatives.componentSubs,otherSubs=this.derivatives.otherSubs;transform&&(transforms[id4]=transform);try{states[id4]=transforms[id4]({get:particleId=>this.get({particleId:particleId,derivativeId:id4,firstTime:!0})})}catch(err){states[id4]=null}this._derivatives[id4]={state:states[id4],getState:payload=>transforms[id4]({get:particleId=>this.get({particleId:particleId,derivativeId:id4}),payload:payload}),subscribe:listener=>(otherSubs[id4]||(otherSubs[id4]=[]),otherSubs[id4].push(listener),()=>{const index=otherSubs[id4].indexOf(listener);otherSubs[id4].splice(index,1)}),detonate:()=>{this._derivatives[id4].state=null,this._derivatives[id4].getState=null,this._derivatives[id4].subscribe=null,this._derivatives[id4].detonate=null,particleSubs[id4].forEach((unsubscribe=>unsubscribe())),delete this._derivatives[id4],delete states[id4],delete transforms[id4],delete particleSubs[id4],delete componentSubs[id4],delete otherSubs[id4]}}}derivative({id:id5,transform:transform1}){return this._derivatives[id5]||this.setDerivative({id:id5,transform:transform1}),this.getDerivative({id:id5})}getTrigger({id:id6}){return this._triggers[id6]?this._triggers[id6]:{invoke:()=>{},subscribe:()=>{},unavailable:!0}}setTrigger({id:id7,initialSubscriptions:initialSubscriptions}){const subscriptions=this.triggers.subscriptions;subscriptions[id7]=initialSubscriptions||[],this._triggers[id7]={invoke:(...payload)=>{subscriptions[id7].forEach((listener=>listener(...payload)))},subscribe:listener=>(subscriptions[id7].push(listener),()=>{const index=subscriptions[id7].indexOf(listener);subscriptions[id7].splice(index,1)}),detonate:()=>{this._triggers[id7].invoke=null,this._triggers[id7].subscribe=null,delete this._triggers[id7],delete subscriptions[id7]}}}trigger({id:id8,initialSubscriptions:initialSubscriptions1}){return this._triggers[id8]||this.setTrigger({id:id8,initialSubscriptions:initialSubscriptions1}),this.getTrigger({id:id8})}}function $ece177b0c5651317$var$adaptEntity(){return $15882dbcd04d9f27$export$5676a8a1d49c85be()}var $ece177b0c5651317$export$2e2bcd8739ae039=$ece177b0c5651317$var$adaptEntity;const $1b0a973eef9c79ee$var$nqtxUpdateArray=[];function $1b0a973eef9c79ee$var$addNqtxUpdate(storeId1){$1b0a973eef9c79ee$var$nqtxUpdateArray.push(storeId1),1===$1b0a973eef9c79ee$var$nqtxUpdateArray.length&&queueMicrotask((()=>{const newNqtxUpdateArray=[...$1b0a973eef9c79ee$var$nqtxUpdateArray];$1b0a973eef9c79ee$var$nqtxUpdateArray.length=0,$15882dbcd04d9f27$export$743647d42396ef87(!0),newNqtxUpdateArray.forEach((storeId=>$15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId))),$15882dbcd04d9f27$export$743647d42396ef87(!1)}))}var $1b0a973eef9c79ee$export$2e2bcd8739ae039=$1b0a973eef9c79ee$var$addNqtxUpdate;function $9a74da07d11fdf6d$var$adaptParticle(id){const currentStore=$15882dbcd04d9f27$export$9d75f3e1a7e94aee(),currentStoreId=$15882dbcd04d9f27$export$9e78cbb868ddafad(),currentEntity=$15882dbcd04d9f27$export$5676a8a1d49c85be();if(currentStore&&!currentStore.particles&&(currentStore.particles=[],currentStore.currentAdaptationIds.particle=0,currentStore.particleCleanups=[],currentStore.currentAdaptationIds.particleCleanup=0),currentStore){if(!(currentStore.currentAdaptationIds.particle in currentStore.particles)){let particle=currentEntity.getParticle({id:id,storeId:currentStoreId});currentStore.particles[currentStore.currentAdaptationIds.particle]=particle[0],currentStore.particleCleanups[currentStore.currentAdaptationIds.particleCleanup]=particle[1],currentStore.particles[currentStore.currentAdaptationIds.particle].unavailable&&$1b0a973eef9c79ee$export$2e2bcd8739ae039(currentStoreId)}if(currentStore.particles[currentStore.currentAdaptationIds.particle].unavailable){let particle=currentEntity.getParticle({id:id,storeId:currentStoreId});currentStore.particles[currentStore.currentAdaptationIds.particle]=particle[0],currentStore.particleCleanups[currentStore.currentAdaptationIds.particleCleanup]=particle[1]}return currentStore.particles[currentStore.currentAdaptationIds.particle++]}throw new Error("adaptParticle() can only be used inside a Component or a Custom Adaptation.")}var $9a74da07d11fdf6d$export$2e2bcd8739ae039=$9a74da07d11fdf6d$var$adaptParticle;function $926bb7bcfd7aed9a$var$adaptTrigger(id){const currentStore=$15882dbcd04d9f27$export$9d75f3e1a7e94aee(),currentStoreId=$15882dbcd04d9f27$export$9e78cbb868ddafad(),currentEntity=$15882dbcd04d9f27$export$5676a8a1d49c85be();if(currentStore&&!currentStore.triggers&&(currentStore.triggers=[],currentStore.currentAdaptationIds.trigger=0),currentStore)return currentStore.currentAdaptationIds.trigger in currentStore.triggers||(currentStore.triggers[currentStore.currentAdaptationIds.trigger]=currentEntity.getTrigger({id:id}),currentStore.triggers[currentStore.currentAdaptationIds.trigger].unavailable&&$1b0a973eef9c79ee$export$2e2bcd8739ae039(currentStoreId)),currentStore.triggers[currentStore.currentAdaptationIds.trigger].unavailable&&(currentStore.triggers[currentStore.currentAdaptationIds.trigger]=currentEntity.getTrigger({id:id})),currentStore.triggers[currentStore.currentAdaptationIds.trigger++];throw new Error("adaptTrigger() can only be used inside a Component or a Custom Adaptation.")}var $926bb7bcfd7aed9a$export$2e2bcd8739ae039=$926bb7bcfd7aed9a$var$adaptTrigger;function $849cb7c2680d1324$var$adaptDerivative(id){const currentStore=$15882dbcd04d9f27$export$9d75f3e1a7e94aee(),currentStoreId=$15882dbcd04d9f27$export$9e78cbb868ddafad(),currentEntity=$15882dbcd04d9f27$export$5676a8a1d49c85be();if(currentStore&&!currentStore.derivatives&&(currentStore.derivatives=[],currentStore.currentAdaptationIds.derivative=0,currentStore.derivativeCleanups=[],currentStore.currentAdaptationIds.derivativeCleanup=0),currentStore){if(!(currentStore.currentAdaptationIds.derivative in currentStore.derivatives)){let derivative=currentEntity.getDerivative({id:id,storeId:currentStoreId});currentStore.derivatives[currentStore.currentAdaptationIds.derivative]=derivative[0],currentStore.derivativeCleanups[currentStore.currentAdaptationIds.derivativeCleanup]=derivative[1],currentStore.derivatives[currentStore.currentAdaptationIds.derivative].unavailable&&$1b0a973eef9c79ee$export$2e2bcd8739ae039(currentStoreId)}if(currentStore.derivatives[currentStore.currentAdaptationIds.derivative].unavailable){let derivative=currentEntity.getDerivative({id:id,storeId:currentStoreId});currentStore.derivatives[currentStore.currentAdaptationIds.derivative]=derivative[0],currentStore.derivativeCleanups[currentStore.currentAdaptationIds.derivativeCleanup]=derivative[1]}return currentStore.derivatives[currentStore.currentAdaptationIds.derivative++]}throw new Error("adaptDerivative() can only be used inside a Component or a Custom Adaptation.")}var $849cb7c2680d1324$export$2e2bcd8739ae039=$849cb7c2680d1324$var$adaptDerivative;export{$97020ee417fa4c70$export$2e2bcd8739ae039 as Entity,$926bb7bcfd7aed9a$export$2e2bcd8739ae039 as adaptTrigger,$ece177b0c5651317$export$2e2bcd8739ae039 as adaptEntity,$9a74da07d11fdf6d$export$2e2bcd8739ae039 as adaptParticle,$849cb7c2680d1324$export$2e2bcd8739ae039 as adaptDerivative};