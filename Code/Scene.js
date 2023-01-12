class Scene
{
    constructor(){
        // Setup
        this.isDoneLoadingScene = false;

        this.width = window.innerWidth*0.2;
        this.height = window.innerHeight*0.2;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0x181849, 1.0);
        document.getElementById('drawcanvas').appendChild(this.renderer.domElement);

        // Set ratio and make it fullscreen
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.width, this.height );
        this.camera.position.setZ(50); // Move the camera a bit back
        this.camera.position.setY(10); // Move the camera a bit up

        // Add some light
        const pointLight = new THREE.PointLight(0xfff5b6)
        pointLight.position.set(-10,20,45);

        // const ambientLight = new THREE.AmbientLight(0xAAAAAA)
        this.scene.add(pointLight);//,ambientLight);

        // Some Helpers (debug)
        this.lightHelper = new THREE.PointLightHelper(pointLight);
        this.gridHelper = new THREE.GridHelper(200,50);
        
        // Add a background texture
        // const spaceTexture = new THREE.TextureLoader().load('assets/space.jpeg');
        // const color5 = new THREE.Color( 'skyblue' );
        // this.scene.background = spaceTexture;

        // Add Fox
        this.fox = new Fox("Data/Fox.gltf",this.scene);

        this.clock = new THREE.Clock();
        this.counter = 0;

        this.initSettings = {};

        // Wait until done loading
        this.start();
        
        setTimeout(() => this.fox.startSleeping(),2000)
    }

    animate(){
        let dt = this.clock.getDelta();

        this.fox.update(dt);

        // Draw
        this.renderer.render( this.scene, this.camera ); 
        this.counter += dt;
    }


    resize(width_,height_) {
        this.camera.aspect = width_ / height_;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( width_, height_ );
    }

        
    propertyListener(properties){
        console.log("Recieving data");
        if (properties.posx){
            document.getElementById("drawcanvas").style.left = `${properties.posx.value}vw`
        }
            
        if (properties.posy){
            document.getElementById("drawcanvas").style.top = `${properties.posy.value}vh`
        }

        if (properties.widthcanvas){
            this.width = window.innerWidth*properties.widthcanvas.value / 100
            this.resize(this.width,this.height);
            // let canvas = document.getElementById("drawcanvas");
            // canvas.style.width = `${properties.posx.value}%`;
        }

        if (properties.heightcanvas){
            this.height = window.innerHeight*properties.heightcanvas.value / 100
            this.resize(this.width,this.height);
            // let canvas = document.getElementById("drawcanvas");
            // canvas.style.height = `${properties.posx.value}%`;
        }
        
        if (properties.enablehelpers){
            if(properties.enablehelpers.value){
                this.scene.add(this.lightHelper, this.gridHelper);
            }
            else{
                this.scene.remove(this.lightHelper, this.gridHelper);
            }
        }
        if (properties.lightx)
            pointLight.position.x = properties.lightx.value;
        if (properties.lighty)
            pointLight.position.y = properties.lighty.value;
        if (properties.lightz)
            pointLight.position.z = properties.lightz.value;
        if (properties.foxx){
            if(this.fox.isDoneLoading())
                this.fox.fox.position.x = properties.foxx.value;
            else
                this.initSettings.foxx = properties.foxx.value;
        }
        if (properties.foxy){
            if(this.fox.isDoneLoading())
                this.fox.fox.position.y = properties.foxy.value;
            else
                this.initSettings.foxy = properties.foxy.value;
        }
        if (properties.foxz){
            if(this.fox.isDoneLoading())
                this.fox.fox.position.z = properties.foxz.value;
            else
                this.initSettings.foxz = properties.foxz.value;
        }
        if (properties.wakeuprate){
            if (properties.wakeuprate.value == 0)
                this.fox.invWakeUpRate = 0;
            else{
                this.fox.invWakeUpRate = (1-properties.wakeuprate.value)*10000+10;
            }
        }
        // if (properties.backgroundimage){
        //     if (properties.backgroundimage.value != "")
        //         document.body.style.backgroundImage = "url('file:///" + properties.backgroundimage.value + "')";
        // }
        // if (properties.backgroundvideo){
        //     document.getElementById("backgroundVideo").setAttribute("src", `file:///${properties.backgroundvideo.value}`);
        // }
        console.log("Done Recieving data");
    }

    start(){
        if (this.fox.isDoneLoading()){
            // this.animate();
            if (this.initSettings.foxx){
                this.fox.fox.position.x = this.initSettings.foxx;
                this.fox.fox.position.y = this.initSettings.foxy;
                this.fox.fox.position.z = this.initSettings.foxz;
            }
            this.isDoneLoadingScene = true;
        }
        else
            setTimeout(() => this.start(),0.1);
    }

    dispose(){
        console.log("Disposing Scene!");

        const disposeMaterial = material => {
            material.dispose();

            // dispose of the texture
            for (const key of Object.keys(material)) {
                const value = material[key]
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    console.log('dispose texture!')
                    value.dispose()
                }
            }
        }

        this.renderer.dispose()
        this.scene.traverse(obj => {
            if (!obj.isMesh) return;
            // Dispose of geometry 
            obj.geometry.dispose();

            // Dispose of the material, check if it is just one material or an array of materials
            if (obj.material.isMaterial)
                disposeMaterial(obj.material);
            else
                for (const material of obj.material) 
                    disposeMaterial(material);
        });

        
    }
}