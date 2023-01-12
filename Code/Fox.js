class Fox{
    constructor(object_path,scene){
        // Create an 'enum' for the animations
        this.States = {
            Walking: 'walking',
            Running: 'running',
            Idle: 'idle',
            IdleSleep: 'idleSleep',
            IdleSleep2: 'idleSleep2',
            IdleSleep3: 'idleSleep3',
            LayingDown: 'layingDown',
            CloseEyes: 'closeEyes',
        };
        Object.freeze(this.States);
        this.state = this.States.Idle;

        // Load Fox (async)
        this.actions = [];
        const glftLoader = new THREE.GLTFLoader();
        glftLoader.load(object_path, (gltfScene) => { // assets/Fox1.gltf
            this.fox = gltfScene.scene;
            this.fox.position.y = 1;
            this.fox.position.z = 30;
            this.fox.position.x = -10;
            this.fox.rotation.y = -Math.PI/2;
            scene.add(this.fox);  // Add the fox to the scene
            this.mixer = new THREE.AnimationMixer(this.fox);  // The animation player  
            const clips = gltfScene.animations;
            
            // Idle
            {
                const clip = THREE.AnimationClip.findByName(clips, 'Idle');   
                this.actions[this.States.Idle] = this.mixer.clipAction(clip);
            }

            // Going to sleep
            {
                const clip = THREE.AnimationClip.findByName(clips, 'LayingDown');   
                this.actions[this.States.LayingDown] = this.mixer.clipAction(clip);
                this.actions[this.States.LayingDown].repetitions = 1;
                this.actions[this.States.LayingDown].clampWhenFinished = true;
            }

            // Idle Sleep
            {
                const clip = THREE.AnimationClip.findByName(clips, 'IdleSleep');   
                this.actions[this.States.IdleSleep] = this.mixer.clipAction(clip);
            }

            // Close eyes
            {
                const clip = THREE.AnimationClip.findByName(clips, 'CloseEyes');   
                this.actions[this.States.CloseEyes] = this.mixer.clipAction(clip);
                this.actions[this.States.CloseEyes].repetitions = 1;
                this.actions[this.States.CloseEyes].clampWhenFinished = true;
            }

            // Idle sleep animations 2&3
            {
                const clip = THREE.AnimationClip.findByName(clips, 'IdleSleep2');   
                this.actions[this.States.IdleSleep2] = this.mixer.clipAction(clip);
                this.actions[this.States.IdleSleep2].repetitions = 1;
                this.actions[this.States.IdleSleep2].clampWhenFinished = true;
            }
            {
                const clip = THREE.AnimationClip.findByName(clips, 'IdleSleep3');   
                this.actions[this.States.IdleSleep3] = this.mixer.clipAction(clip);
                this.actions[this.States.IdleSleep3].repetitions = 1;
                this.actions[this.States.IdleSleep3].clampWhenFinished = true;
            }
            
            this.actions[this.States.Idle].play();
        })

        // Other variables
        this.isSleeping = false;
        this.isBusy = false;
        this.invWakeUpRate = 1000;
    }

    isDoneLoading(){
        if (this.fox && this.mixer) 
            return true;
        return false;
    }

    update(dt){
        if (!this.mixer)
            return;
        if (this.isSleeping && !this.isBusy){
            let num = Math.floor(Math.random()*this.invWakeUpRate);
            if ( num == 5){
                // Do an sleeping animation 2
                this.sleepingAnimation(2);
            } else if (num == 6){
                // Do sleeping animation 3
                this.sleepingAnimation(3);
            }
        }
        this.mixer.update(dt);

    }

    switchTo(newState, strength){
        this.actions[newState].reset();
        if (!strength)
            strength=1;
        this.actions[newState].play();
        this.actions[this.state].crossFadeTo( this.actions[newState], strength );
        this.state = newState;
    }

    switchToLayingDown(){
        this.switchTo(this.States.LayingDown);
    }

    switchToIdle(){
        this.switchTo(this.States.Idle);
    }

    switchToWalking(){
        this.switchTo(this.States.Walking);
    }

    switchToRunning(){

    }

    startSleeping(){
        this.switchToLayingDown();
        setTimeout(() => this.switchTo(this.States.IdleSleep), 1000);
        setTimeout(() => this.actions[this.States.CloseEyes].play(), 2000);
        setTimeout(() => this.isSleeping = true, 4000);
    }

    // Wakes up for a second to look around and then go back to sleeping
    sleepingAnimation(type){
        this.isBusy = true;
        // Open eyes
        this.actions[this.States.CloseEyes].reset();
        this.actions[this.States.CloseEyes].setEffectiveTimeScale(-1).play();
        // Wake up
        switch (type) {
            case 2:
                this.switchTo(this.States.IdleSleep2);        
                break;
            case 3:
            default:
                this.switchTo(this.States.IdleSleep3);        
                break;
        }

        // Go sleep again
        setTimeout(() => { this.switchTo(this.States.IdleSleep); this.isBusy = false; }, 10000);
        setTimeout(() => this.actions[this.States.CloseEyes].setEffectiveTimeScale(1).reset().play(), 8000);
    }
}