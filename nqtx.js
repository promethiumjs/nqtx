let $15882dbcd04d9f27$var$currentEntity;
function $15882dbcd04d9f27$export$33b9e1ccb5643ac8(entity) {
    $15882dbcd04d9f27$var$currentEntity = entity;
}
function $15882dbcd04d9f27$export$5676a8a1d49c85be() {
    return $15882dbcd04d9f27$var$currentEntity;
}
let $15882dbcd04d9f27$var$getCurrentStoreMethod;
function $15882dbcd04d9f27$export$9d75f3e1a7e94aee(storeId) {
    return $15882dbcd04d9f27$var$getCurrentStoreMethod(storeId);
}
let $15882dbcd04d9f27$var$getCurrentStoreIdMethod;
function $15882dbcd04d9f27$export$9e78cbb868ddafad() {
    return $15882dbcd04d9f27$var$getCurrentStoreIdMethod();
}
let $15882dbcd04d9f27$var$renderComponentMethod;
function $15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId) {
    $15882dbcd04d9f27$var$renderComponentMethod(storeId);
}
function $15882dbcd04d9f27$export$6ceec5925def9744({ getCurrentStore: getCurrentStore , getCurrentStoreId: getCurrentStoreId , renderComponent: renderComponent ,  }) {
    $15882dbcd04d9f27$var$getCurrentStoreMethod = getCurrentStore;
    $15882dbcd04d9f27$var$getCurrentStoreIdMethod = getCurrentStoreId;
    $15882dbcd04d9f27$var$renderComponentMethod = renderComponent;
}



const $7d5f7cf9280c513a$var$subscriptionArray1 = [];
const $7d5f7cf9280c513a$var$subscriptionArray2 = [];
let $7d5f7cf9280c513a$var$one = true;
function $7d5f7cf9280c513a$export$2e2bcd8739ae039(subscription1) {
    if ($7d5f7cf9280c513a$var$one) {
        $7d5f7cf9280c513a$var$subscriptionArray1.push(subscription1);
        if ($7d5f7cf9280c513a$var$subscriptionArray1.length === 1) setTimeout(()=>{
            $7d5f7cf9280c513a$var$one = false;
            $7d5f7cf9280c513a$var$subscriptionArray1.forEach((subscription)=>subscription()
            );
            $7d5f7cf9280c513a$var$subscriptionArray1.length = 0;
        });
    } else {
        $7d5f7cf9280c513a$var$subscriptionArray2.push(subscription1);
        if ($7d5f7cf9280c513a$var$subscriptionArray2.length === 1) setTimeout(()=>{
            $7d5f7cf9280c513a$var$one = true;
            $7d5f7cf9280c513a$var$subscriptionArray2.forEach((subscription)=>subscription()
            );
            $7d5f7cf9280c513a$var$subscriptionArray2.length = 0;
        });
    }
}


function $902aaab0efe07d29$export$2e2bcd8739ae039({ particleId: particleId , newState: newState  }) {
    const _particle = this._particles[particleId];
    const states = this.particles.states;
    const derivativeSubs = this.particles.derivativeSubs;
    const componentSubs = this.particles.componentSubs;
    const otherSubs = this.particles.otherSubs;
    const otherSubs_instant = this.particles.otherSubs_instant;
    const previousState = _particle.state;
    if (_particle.previous !== undefined) _particle.previous = previousState;
    //the state has to be updated in two places because of the presence of this.particles
    //and this._particles.
    if (newState !== undefined) {
        if (Object.is(newState, previousState)) return;
        _particle.state = newState;
        states[particleId] = newState;
    }
    //update all subscribers.
    if (otherSubs_instant[particleId]) otherSubs_instant[particleId].forEach((listener)=>listener(newState, previousState)
    );
    if (derivativeSubs[particleId]) derivativeSubs[particleId].forEach((derivativeId)=>this.update({
            derivativeId: derivativeId
        })
    );
    if (componentSubs[particleId]) componentSubs[particleId].forEach((storeId)=>$15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId)
    );
    if (otherSubs[particleId]) otherSubs[particleId].forEach((listener)=>$7d5f7cf9280c513a$export$2e2bcd8739ae039(()=>listener(newState, previousState)
        )
    );
}


function $879cb4b1148b8835$export$2e2bcd8739ae039({ particleId: particleId  }) {
    const $context = this._particles[particleId];
    if ($context === undefined) {
        console.error(`The particle you are trying to access with id: ${particleId} doesn't exist`);
        throw new Error(`Cannot access context of particle: "${particleId}"`);
    }
    return $context;
}


function $d235f34bfb2a06a3$export$2e2bcd8739ae039({ particleId: particleId , derivativeId: derivativeId , firstTime: firstTime  }) {
    const states = this.particles.states;
    if (states[particleId] === undefined) {
        console.error(`The particle you are trying to access with id: ${particleId} doesn't exist or has its
       state set to undefined`);
        throw new Error(`Cannot access state of particle: "${particleId}"`);
    }
    //add to derivative subscriptions if the derivative is now being initialized and hasn't
    //yet been added.
    if (firstTime) {
        const derivativeSubs = this.particles.derivativeSubs;
        if (derivativeSubs[particleId]) {
            if (derivativeSubs[particleId].includes(derivativeId)) //return value if derivative has already been added to subscriptions
            return states[particleId];
            derivativeSubs[particleId].push(derivativeId);
        } else {
            derivativeSubs[particleId] = [];
            derivativeSubs[particleId].push(derivativeId);
        }
        const particleSubs = this.derivatives.particleSubs;
        const unsubscribe = ()=>{
            //try catch to prevent crashing due to errors in case the
            //particle has already been deleted.
            try {
                const index = derivativeSubs[particleId].indexOf(derivativeId);
                derivativeSubs[particleId].splice(index, 1);
            } catch (err) {
            //throw error into the abyss.
            }
        };
        if (particleSubs[derivativeId]) particleSubs[derivativeId].push(unsubscribe);
        else {
            particleSubs[derivativeId] = [];
            particleSubs[derivativeId].push(unsubscribe);
        }
    }
    return states[particleId];
}


function $50697289dc74b922$export$2e2bcd8739ae039({ particleId: particleId , derivativeId: derivativeId , firstTime: firstTime ,  }) {
    const _particle = this._particles[particleId];
    if (!_particle || _particle.previous === undefined) {
        console.warn(`The particle you are trying to access with id: ${particleId} either doesn't exist,
       has it's previous state set to undefined, or doesn't have it's "previousState" 
       flag set to true`);
        throw new Error(`Cannot access previous state of particle: "${particleId}"`);
    }
    //add to derivative subscriptions if the derivative is now being initialized and hasn't
    //yet been added.
    if (firstTime) {
        const derivativeSubs = this.particles.derivativeSubs;
        if (derivativeSubs[particleId]) {
            if (derivativeSubs[particleId].includes(derivativeId)) //return value if derivative has already been added to subscriptions.
            return _particle.previous;
            derivativeSubs[particleId].push(derivativeId);
        } else {
            derivativeSubs[particleId] = [];
            derivativeSubs[particleId].push(derivativeId);
        }
        const particleSubs = this.derivatives.particleSubs;
        const unsubscribe = ()=>{
            //try catch to prevent crashing due to errors in case the
            //particle has already been deleted.
            try {
                const index = derivativeSubs[particleId].indexOf(derivativeId);
                derivativeSubs[particleId].splice(index, 1);
            } catch (err) {
            //throw error into the abyss.
            }
        };
        if (particleSubs[derivativeId]) particleSubs[derivativeId].push(unsubscribe);
        else {
            particleSubs[derivativeId] = [];
            particleSubs[derivativeId].push(unsubscribe);
        }
    }
    return _particle.previous;
}




function $f79f91d23d669bcf$export$2e2bcd8739ae039({ derivativeId: derivativeId  }) {
    const _derivative = this._derivatives[derivativeId];
    const states = this.derivatives.states;
    const transforms = this.derivatives.transforms;
    const componentSubs = this.derivatives.componentSubs;
    const otherSubs = this.derivatives.otherSubs;
    const otherSubs_instant = this.derivatives.otherSubs_instant;
    const previousState = _derivative.state;
    if (_derivative.previous !== undefined) _derivative.previous = previousState;
    //generate new state of derivative.
    let newState;
    try {
        newState = transforms[derivativeId]({
            getState: (particleId)=>this.getState({
                    particleId: particleId,
                    derivativeId: derivativeId
                })
            ,
            getPreviousState: (particleId)=>this.getPreviousState({
                    particleId: particleId
                })
            ,
            state: states[derivativeId]
        });
    } catch (err) {
        newState = null;
    }
    //the state has to be updated in two places because of the presence of this.derivatives
    //and this._derivatives.
    if (newState === undefined) return;
    if (Object.is(newState, previousState)) return;
    _derivative.state = newState;
    states[derivativeId] = newState;
    //update all subscribers.
    if (otherSubs_instant[derivativeId]) otherSubs_instant[derivativeId].forEach((listener)=>listener(newState, previousState)
    );
    if (componentSubs[derivativeId]) componentSubs[derivativeId].forEach((storeId)=>$15882dbcd04d9f27$export$fa7f552cb3a457a6(storeId)
    );
    if (otherSubs[derivativeId]) otherSubs[derivativeId].forEach((listener)=>$7d5f7cf9280c513a$export$2e2bcd8739ae039(()=>listener(newState, previousState)
        )
    );
}


function $aa4dfc1f0c762d24$export$2e2bcd8739ae039({ id: id , storeId: storeId  }) {
    if (!this._particles[id]) {
        console.error(`You are trying to access a particle with id: "${id}" that doesn't yet exist`);
        throw new Error(`Particle: "${id}" is not accessible`);
    }
    //add storeId to component subscriptions if present.
    if (storeId) {
        const componentSubs = this.particles.componentSubs;
        if (componentSubs[id]) componentSubs[id].push(storeId);
        else {
            componentSubs[id] = [];
            componentSubs[id].push(storeId);
        }
        const unsubscribe = ()=>{
            //try catch to prevent crashing due to errors in case the
            //particle has already been deleted.
            try {
                const index = componentSubs[id].indexOf(storeId);
                componentSubs[id].splice(index, 1);
            } catch (err) {
            //throw error into the abyss.
            }
        };
        return [
            this._particles[id],
            unsubscribe
        ];
    }
    return this._particles[id];
}


function $bb1f9ff5f7d19e8e$export$2e2bcd8739ae039({ id: id , initialState: initialState , mutations: mutations , actions: actions , previousState: previousState ,  }) {
    const states = this.particles.states;
    const mutationStore = this.particles.mutations;
    const actionStore = this.particles.actions;
    const derivativeSubs = this.particles.derivativeSubs;
    const componentSubs = this.particles.componentSubs;
    const otherSubs = this.particles.otherSubs;
    const otherSubs_instant = this.particles.otherSubs_instant;
    if (initialState !== undefined) states[id] = initialState;
    else if (states[id] === undefined) states[id] = null;
    if (mutations) mutationStore[id] = mutations;
    if (actions) actionStore[id] = actions;
    this._particles[id] = {
        state: states[id],
        get: ()=>states[id]
        ,
        commit: (mutation, payload)=>{
            this.set({
                particleId: id,
                newState: mutationStore[id][mutation]({
                    state: states[id],
                    payload: payload
                })
            });
        },
        dispatch: (action, payload)=>{
            return actionStore[id][action]({
                $context: this._particles[id],
                payload: payload
            });
        },
        set: (newState)=>this.set({
                particleId: id,
                newState: newState
            })
        ,
        subscribe: (listener)=>{
            if (otherSubs[id]) otherSubs[id].push(listener);
            else {
                otherSubs[id] = [];
                otherSubs[id].push(listener);
            }
            return ()=>{
                try {
                    const index = otherSubs[id].indexOf(listener);
                    otherSubs[id].splice(index, 1);
                } catch (err) {
                }
            };
        },
        subscribe_instant: (listener)=>{
            if (otherSubs_instant[id]) otherSubs_instant[id].push(listener);
            else {
                otherSubs_instant[id] = [];
                otherSubs_instant[id].push(listener);
            }
            return ()=>{
                try {
                    const index = otherSubs_instant[id].indexOf(listener);
                    otherSubs_instant[id].splice(index, 1);
                } catch (err) {
                }
            };
        },
        detonate: ()=>{
            //set properties to null to release all existing references to the particle
            //and it's properties to enable garbage collection and avoid memory leaks.
            this._particles[id].state = null;
            this._particles[id].previous = null;
            this._particles[id].get = null;
            this._particles[id].commit = null;
            this._particles[id].dispatch = null;
            this._particles[id].set = null;
            this._particles[id].subscribe = null;
            this._particles[id].subscribe_instant = null;
            this._particles[id].detonate = null;
            delete this._particles[id];
            delete states[id];
            delete mutationStore[id];
            delete actionStore[id];
            delete derivativeSubs[id];
            delete componentSubs[id];
            delete otherSubs[id];
            delete otherSubs_instant[id];
        }
    };
    if (previousState) this._particles[id].previous = states[id];
}


function $54f4621744d73147$export$2e2bcd8739ae039({ id: id , initialState: initialState , transform: transform , previousState: previousState ,  }) {
    const states = this.derivatives.states;
    const transforms = this.derivatives.transforms;
    const particleSubs = this.derivatives.particleSubs;
    const componentSubs = this.derivatives.componentSubs;
    const otherSubs = this.derivatives.otherSubs;
    const otherSubs_instant = this.derivatives.otherSubs_instant;
    if (transform) transforms[id] = transform;
    if (initialState !== undefined) states[id] = initialState;
    else if (states[id] === undefined) {
        try {
            states[id] = transforms[id]({
                getState: (particleId)=>this.getState({
                        particleId: particleId,
                        derivativeId: id,
                        firstTime: true
                    })
                ,
                getPreviousState: (particleId)=>this.getPreviousState({
                        particleId: particleId,
                        derivativeId: id,
                        firstTime: true
                    })
            });
        } catch (err) {
            states[id] = null;
        }
        if (states[id] === undefined) states[id];
    }
    this._derivatives[id] = {
        state: states[id],
        get: (payload)=>{
            return transforms[id]({
                getState: (particleId)=>this.getState({
                        particleId: particleId,
                        derivativeId: id
                    })
                ,
                getPreviousState: (particleId)=>this.getPreviousState({
                        particleId: particleId,
                        derivativeId: id
                    })
                ,
                payload: payload,
                state: states[id]
            });
        },
        subscribe: (listener)=>{
            if (otherSubs[id]) otherSubs[id].push(listener);
            else {
                otherSubs[id] = [];
                otherSubs[id].push(listener);
            }
            return ()=>{
                try {
                    const index = otherSubs[id].indexOf(listener);
                    otherSubs[id].splice(index, 1);
                } catch (err) {
                }
            };
        },
        subscribe_instant: (listener)=>{
            if (otherSubs_instant[id]) otherSubs_instant[id].push(listener);
            else {
                otherSubs_instant[id] = [];
                otherSubs_instant[id].push(listener);
            }
            return ()=>{
                try {
                    const index = otherSubs_instant[id].indexOf(listener);
                    otherSubs_instant[id].splice(index, 1);
                } catch (err) {
                }
            };
        },
        detonate: ()=>{
            //set properties to null to release all existing references to the derivative
            //and it's properties to enable garbage collection and avoid memory leaks.
            this._derivatives[id].state = null;
            this._derivatives[id].previous = null;
            this._derivatives[id].get = null;
            this._derivatives[id].subscribe = null;
            this._derivatives[id].subscribe_instant = null;
            this._derivatives[id].detonate = null;
            //unsubscribe from all particles currently subscribed to.
            particleSubs[id].forEach((unsubscribe)=>unsubscribe()
            );
            delete this._derivatives[id];
            delete states[id];
            delete transforms[id];
            delete particleSubs[id];
            delete componentSubs[id];
            delete otherSubs[id];
        }
    };
    if (previousState) this._derivatives[id].previous = states[id];
}


function $e59d7b2581ef6c73$export$2e2bcd8739ae039({ id: id , storeId: storeId  }) {
    if (!this._derivatives[id]) {
        console.error(`You are trying to access a derivative with id: "${id}" that doesn't yet exist`);
        throw new Error(`Derivative: "${id}" is not accessible`);
    }
    //add storeId to component subscriptions if present.
    if (storeId) {
        const componentSubs = this.derivatives.componentSubs;
        if (componentSubs[id]) componentSubs[id].push(storeId);
        else {
            componentSubs[id] = [];
            componentSubs[id].push(storeId);
        }
        const unsubscribe = ()=>{
            //try catch to prevent crashing due to errors in case the
            //derivative has already been deleted.
            try {
                const index = componentSubs[id].indexOf(storeId);
                componentSubs[id].splice(index, 1);
            } catch (err) {
            //throw error into the abyss.
            }
        };
        return [
            this._derivatives[id],
            unsubscribe
        ];
    }
    return this._derivatives[id];
}


function $e6be5c805115b01b$export$2e2bcd8739ae039({ id: id , actions: actions  }) {
    if (this._catalysts[id]) return this.getCatalyst({
        id: id
    });
    this.setCatalyst({
        id: id,
        actions: actions
    });
    return this.getCatalyst({
        id: id
    });
}


function $d9e7c8fd46a4c6fb$export$2e2bcd8739ae039({ id: id  }) {
    if (!this._catalysts[id]) {
        console.error(`You are trying to access a catalyst with id: "${id}" that doesn't yet exist`);
        throw new Error(`Catalyst: "${id}" is not accessible`);
    }
    return this._catalysts[id];
}


function $a7a18180d5fc2b10$export$2e2bcd8739ae039({ id: id , actions: actions  }) {
    const actionStore = this.catalysts.actions;
    if (actions) actionStore[id] = actions;
    this._catalysts[id] = {
        dispatch: (action, payload)=>{
            return actionStore[id][action]({
                getContext: (particleId)=>this.getContext({
                        particleId: particleId
                    })
                ,
                payload: payload
            });
        },
        detonate: ()=>{
            //set properties to null to release all existing references to the catalyst
            //and it's properties to enable garbage collection and avoid memory leaks.
            this._catalysts[id].dispatch = null;
            this._catalysts[id].detonate = null;
            delete this._catalysts[id];
            delete actionStore[id];
        }
    };
}


function $dcf105ea6755ba11$export$2e2bcd8739ae039({ id: id  }) {
    if (!this._triggers[id]) {
        console.error(`You are trying to access a trigger with id: "${id}" that doesn't yet exist`);
        throw new Error(`Trigger: "${id}" is not accessible`);
    }
    return this._triggers[id];
}


function $72a4bf13730488a1$export$2e2bcd8739ae039({ id: id , initialSubscriptions: initialSubscriptions  }) {
    const subscriptions = this.triggers.subscriptions;
    subscriptions[id] = initialSubscriptions || [];
    this._triggers[id] = {
        invoke: (...payload)=>{
            subscriptions[id].forEach((listener)=>listener(...payload)
            );
        },
        subscribe: (listener)=>{
            subscriptions[id].push(listener);
            return ()=>{
                try {
                    const index = subscriptions[id].indexOf(listener);
                    subscriptions[id].splice(index, 1);
                } catch (err) {
                }
            };
        },
        detonate: ()=>{
            //set properties to null to release all existing references to the trigger
            //and it's properties to enable garbage collection and avoid memory leaks.
            this._triggers[id].invoke = null;
            this._triggers[id].subscribe = null;
            this._triggers[id].detonate = null;
            delete this._triggers[id];
            delete subscriptions[id];
        }
    };
}


function $f622ad01ce93fdf1$export$2e2bcd8739ae039({ id: id , initialState: initialState , mutations: mutations , actions: actions , overwrite: overwrite , previousState: previousState ,  }) {
    if (this._particles[id]) return this.getParticle({
        id: id
    });
    //initialize particle based on provided data.
    const states = this.particles.states;
    if (!states[id]) this.setParticle({
        id: id,
        initialState: initialState,
        mutations: mutations,
        actions: actions,
        previousState: previousState
    });
    else if (states[id] && !overwrite) this.setParticle({
        id: id,
        mutations: mutations,
        actions: actions,
        previousState: previousState
    });
    else this.setParticle({
        id: id,
        initialState: initialState,
        mutations: mutations,
        actions: actions,
        previousState: previousState
    });
    return this.getParticle({
        id: id
    });
}


function $27b0167c3fafa3b0$export$2e2bcd8739ae039({ id: id , initialState: initialState , transform: transform , overwrite: overwrite , previousState: previousState ,  }) {
    if (this._derivatives[id]) return this.getDerivative({
        id: id
    });
    //initialize particle based on provided data.
    const states = this.derivatives.states;
    if (!states[id]) this.setDerivative({
        id: id,
        initialState: initialState,
        transform: transform,
        previousState: previousState
    });
    else if (states[id] && !overwrite) this.setDerivative({
        id: id,
        transform: transform,
        previousState: previousState
    });
    else this.setDerivative({
        id: id,
        initialState: initialState,
        transform: transform,
        previousState: previousState
    });
    return this.getDerivative({
        id: id
    });
}


function $e3cdf8d044a86bbf$export$2e2bcd8739ae039({ id: id , initialSubscriptions: initialSubscriptions  }) {
    if (this._triggers[id]) return this.getTrigger({
        id: id
    });
    this.setTrigger({
        id: id,
        initialSubscriptions: initialSubscriptions
    });
    return this.getTrigger({
        id: id
    });
}


class $97020ee417fa4c70$export$2e2bcd8739ae039 {
    constructor(initial){
        //initialize particles(with initial states if any).
        this.particles = {
            states: initial ? initial.particleStates || {
            } : {
            },
            mutations: {
            },
            actions: {
            },
            derivativeSubs: {
            },
            componentSubs: {
            },
            otherSubs: {
            },
            otherSubs_instant: {
            }
        };
        this._particles = {
        };
        //initialize derivatives(with initial states if any).
        this.derivatives = {
            states: initial ? initial.derivativeStates || {
            } : {
            },
            transforms: {
            },
            particleSubs: {
            },
            componentSubs: {
            },
            otherSubs: {
            },
            otherSubs_instant: {
            }
        };
        this._derivatives = {
        };
        //initialize triggers.
        this.triggers = {
            subscriptions: {
            }
        };
        this._triggers = {
        };
        //initialize catalysts.
        this.catalysts = {
            actions: {
            }
        };
        this._catalysts = {
        };
        //initialize methods
        this.particle = $f622ad01ce93fdf1$export$2e2bcd8739ae039.bind(this);
        this.derivative = $27b0167c3fafa3b0$export$2e2bcd8739ae039.bind(this);
        this.catalyst = $e6be5c805115b01b$export$2e2bcd8739ae039.bind(this);
        this.trigger = $e3cdf8d044a86bbf$export$2e2bcd8739ae039.bind(this);
        this.set = $902aaab0efe07d29$export$2e2bcd8739ae039.bind(this);
        this.getContext = $879cb4b1148b8835$export$2e2bcd8739ae039.bind(this);
        this.getState = $d235f34bfb2a06a3$export$2e2bcd8739ae039.bind(this);
        this.getPreviousState = $50697289dc74b922$export$2e2bcd8739ae039.bind(this);
        this.update = $f79f91d23d669bcf$export$2e2bcd8739ae039.bind(this);
        this.getParticle = $aa4dfc1f0c762d24$export$2e2bcd8739ae039.bind(this);
        this.setParticle = $bb1f9ff5f7d19e8e$export$2e2bcd8739ae039.bind(this);
        this.getDerivative = $e59d7b2581ef6c73$export$2e2bcd8739ae039.bind(this);
        this.setDerivative = $54f4621744d73147$export$2e2bcd8739ae039.bind(this);
        this.getCatalyst = $d9e7c8fd46a4c6fb$export$2e2bcd8739ae039.bind(this);
        this.setCatalyst = $a7a18180d5fc2b10$export$2e2bcd8739ae039.bind(this);
        this.getTrigger = $dcf105ea6755ba11$export$2e2bcd8739ae039.bind(this);
        this.setTrigger = $72a4bf13730488a1$export$2e2bcd8739ae039.bind(this);
    }
    static create(initialParticleStates) {
        const entity = new $97020ee417fa4c70$export$2e2bcd8739ae039(initialParticleStates);
        $15882dbcd04d9f27$export$33b9e1ccb5643ac8(entity);
        return entity;
    }
    //obtain adaptation methods from nqtui to power nqtx adaptations.
    addAdaptationMethods(methods) {
        $15882dbcd04d9f27$export$6ceec5925def9744(methods);
    }
    getParticleStates() {
        return this.particles.states;
    }
    setParticleStates(particleStates) {
        Object.assign(this.particles.states, particleStates);
        Object.keys(particleStates).forEach((particleId)=>this.set({
                particleId: particleId,
                newState: particleStates[particleId]
            })
        );
    }
    setDerivativeStates(derivativeStates) {
        Object.assign(this.derivatives.states, derivativeStates);
    }
    getDerivativeStates() {
        return this.derivatives.states;
    }
}



function $ece177b0c5651317$var$adaptEntity() {
    return $15882dbcd04d9f27$export$5676a8a1d49c85be();
}
var $ece177b0c5651317$export$2e2bcd8739ae039 = $ece177b0c5651317$var$adaptEntity;



function $9a74da07d11fdf6d$var$adaptParticle(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.particles) {
        currentStore.particles = [];
        currentStore.currentAdaptationIds.particle = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.particle in currentStore.particles)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.particleCleanups) {
                    currentStore.particleCleanups = [];
                    currentStore.currentAdaptationIds.particleCleanup = 0;
                }
                let particle = currentEntity.getParticle({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle[0];
                currentStore.particleCleanups[currentStore.currentAdaptationIds.particleCleanup] = particle[1];
            } else {
                let particle = currentEntity.getParticle({
                    id: id
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle;
            }
        }
        let $particleContext = currentStore.particles[currentStore.currentAdaptationIds.particle++];
        return [
            $particleContext.state,
            $particleContext
        ];
    } else throw new Error("adaptParticle() can only be used inside a Component or a Custom Adaptation.");
}
var $9a74da07d11fdf6d$export$2e2bcd8739ae039 = $9a74da07d11fdf6d$var$adaptParticle;



function $ceb05100fd2500e8$var$adaptParticleState(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.particles) {
        currentStore.particles = [];
        currentStore.currentAdaptationIds.particle = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.particle in currentStore.particles)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.particleCleanups) {
                    currentStore.particleCleanups = [];
                    currentStore.currentAdaptationIds.particleCleanup = 0;
                }
                let particle = currentEntity.getParticle({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle[0];
                currentStore.particleCleanups[currentStore.currentAdaptationIds.particleCleanup] = particle[1];
            } else {
                let particle = currentEntity.getParticle({
                    id: id
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle;
            }
        }
        return currentStore.particles[currentStore.currentAdaptationIds.particle++].state;
    } else throw new Error("adaptParticleState() can only be used inside a Component or a Custom Adaptation.");
}
var $ceb05100fd2500e8$export$2e2bcd8739ae039 = $ceb05100fd2500e8$var$adaptParticleState;



function $ea8a4a6bd2bb09ab$var$adaptParticleContext(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.particles) {
        currentStore.particles = [];
        currentStore.currentAdaptationIds.particle = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.particle in currentStore.particles)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.particleCleanups) {
                    currentStore.particleCleanups = [];
                    currentStore.currentAdaptationIds.particleCleanup = 0;
                }
                let particle = currentEntity.getParticle({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle[0];
                currentStore.particleCleanups[currentStore.currentAdaptationIds.particleCleanup] = particle[1];
            } else {
                let particle = currentEntity.getParticle({
                    id: id
                });
                currentStore.particles[currentStore.currentAdaptationIds.particle] = particle;
            }
        }
        return currentStore.particles[currentStore.currentAdaptationIds.particle++];
    } else throw new Error("adaptParticleContext() can only be used inside a Component or a Custom Adaptation.");
}
var $ea8a4a6bd2bb09ab$export$2e2bcd8739ae039 = $ea8a4a6bd2bb09ab$var$adaptParticleContext;



function $849cb7c2680d1324$var$adaptDerivative(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.derivatives) {
        currentStore.derivatives = [];
        currentStore.currentAdaptationIds.derivative = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.derivative in currentStore.derivatives)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.derivativeCleanups) {
                    currentStore.derivativeCleanups = [];
                    currentStore.currentAdaptationIds.derivativeCleanup = 0;
                }
                let derivative = currentEntity.getDerivative({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative[0];
                currentStore.derivativeCleanups[currentStore.currentAdaptationIds.derivativeCleanup] = derivative[1];
            } else {
                let derivative = currentEntity.getDerivative({
                    id: id
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative;
            }
        }
        let $derivativeContext = currentStore.derivatives[currentStore.currentAdaptationIds.derivative++];
        return [
            $derivativeContext.state,
            $derivativeContext
        ];
    } else throw new Error("adaptDerivative() can only be used inside a Component or a Custom Adaptation.");
}
var $849cb7c2680d1324$export$2e2bcd8739ae039 = $849cb7c2680d1324$var$adaptDerivative;



function $1345bacf9dba2843$var$adaptDerivativeState(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.derivatives) {
        currentStore.derivatives = [];
        currentStore.currentAdaptationIds.derivative = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.derivative in currentStore.derivatives)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.derivativeCleanups) {
                    currentStore.derivativeCleanups = [];
                    currentStore.currentAdaptationIds.derivativeCleanup = 0;
                }
                let derivative = currentEntity.getDerivative({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative[0];
                currentStore.derivativeCleanups[currentStore.currentAdaptationIds.derivativeCleanup] = derivative[1];
            } else {
                let derivative = currentEntity.getDerivative({
                    id: id
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative;
            }
        }
        return currentStore.derivatives[currentStore.currentAdaptationIds.derivative++].state;
    } else throw new Error("adaptDerivativeState() can only be used inside a Component or a Custom Adaptation.");
}
var $1345bacf9dba2843$export$2e2bcd8739ae039 = $1345bacf9dba2843$var$adaptDerivativeState;



function $c1cffa53e75091bc$var$adaptDerivativeContext(id, subscribe) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentStoreId = $15882dbcd04d9f27$export$9e78cbb868ddafad();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.derivatives) {
        currentStore.derivatives = [];
        currentStore.currentAdaptationIds.derivative = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.derivative in currentStore.derivatives)) {
            if (subscribe === undefined || subscribe === true) {
                if (currentStore && !currentStore.derivativeCleanups) {
                    currentStore.derivativeCleanups = [];
                    currentStore.currentAdaptationIds.derivativeCleanup = 0;
                }
                let derivative = currentEntity.getDerivative({
                    id: id,
                    storeId: currentStoreId
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative[0];
                currentStore.derivativeCleanups[currentStore.currentAdaptationIds.derivativeCleanup] = derivative[1];
            } else {
                let derivative = currentEntity.getDerivative({
                    id: id
                });
                currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = derivative;
            }
        }
        return currentStore.derivatives[currentStore.currentAdaptationIds.derivative++];
    } else throw new Error("adaptDerivativeContext() can only be used inside a Component or a Custom Adaptation.");
}
var $c1cffa53e75091bc$export$2e2bcd8739ae039 = $c1cffa53e75091bc$var$adaptDerivativeContext;



function $250dc15cc8cabef2$var$adaptCatalyst(id) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.catalysts) {
        currentStore.catalysts = [];
        currentStore.currentAdaptationIds.catalyst = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.catalyst in currentStore.catalysts)) currentStore.catalysts[currentStore.currentAdaptationIds.catalyst] = currentEntity.getCatalyst({
            id: id
        });
        return currentStore.catalysts[currentStore.currentAdaptationIds.catalyst++];
    } else throw new Error("adaptCatalyst() can only be used inside a Component or a Custom Adaptation.");
}
var $250dc15cc8cabef2$export$2e2bcd8739ae039 = $250dc15cc8cabef2$var$adaptCatalyst;



function $926bb7bcfd7aed9a$var$adaptTrigger(id) {
    const currentStore = $15882dbcd04d9f27$export$9d75f3e1a7e94aee();
    const currentEntity = $15882dbcd04d9f27$export$5676a8a1d49c85be();
    if (currentStore && !currentStore.triggers) {
        currentStore.triggers = [];
        currentStore.currentAdaptationIds.trigger = 0;
    }
    if (currentStore) {
        if (!(currentStore.currentAdaptationIds.trigger in currentStore.triggers)) currentStore.triggers[currentStore.currentAdaptationIds.trigger] = currentEntity.getTrigger({
            id: id
        });
        return currentStore.triggers[currentStore.currentAdaptationIds.trigger++];
    } else throw new Error("adaptTrigger() can only be used inside a Component or a Custom Adaptation.");
}
var $926bb7bcfd7aed9a$export$2e2bcd8739ae039 = $926bb7bcfd7aed9a$var$adaptTrigger;


var $4482393ea882a0c5$export$2e2bcd8739ae039 = $97020ee417fa4c70$export$2e2bcd8739ae039;


export {$4482393ea882a0c5$export$2e2bcd8739ae039 as default, $ece177b0c5651317$export$2e2bcd8739ae039 as adaptEntity, $9a74da07d11fdf6d$export$2e2bcd8739ae039 as adaptParticle, $ceb05100fd2500e8$export$2e2bcd8739ae039 as adaptParticleState, $ea8a4a6bd2bb09ab$export$2e2bcd8739ae039 as adaptParticleContext, $849cb7c2680d1324$export$2e2bcd8739ae039 as adaptDerivative, $1345bacf9dba2843$export$2e2bcd8739ae039 as adaptDerivativeState, $c1cffa53e75091bc$export$2e2bcd8739ae039 as adaptDerivativeContext, $250dc15cc8cabef2$export$2e2bcd8739ae039 as adaptCatalyst, $926bb7bcfd7aed9a$export$2e2bcd8739ae039 as adaptTrigger};
//# sourceMappingURL=nqtx.js.map
