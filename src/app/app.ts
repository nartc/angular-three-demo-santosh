import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend, injectBeforeRender, NgtArgs, NgtCanvas, NgtPush } from 'angular-three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders';
import { NgtsEnvironment, NgtsFloat } from 'angular-three-soba/staging';
import { map } from 'rxjs';
import * as THREE from 'three';
import { Color, Fog, Mesh, PlaneGeometry, PointLight, ShadowMaterial, Vector2 } from 'three';

extend({ Mesh, Fog, PlaneGeometry, ShadowMaterial, PointLight, Vector2, Color });

@Component({
    standalone: true,
    templateUrl: './scene.html',
    imports: [NgtArgs, NgtPush, NgtsOrbitControls, NgtsEnvironment, NgtsFloat],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
    readonly Math = Math;
    private mixer?: THREE.AnimationMixer;

    readonly model$ = injectNgtsGLTFLoader('assets/scene.gltf').pipe(
        map((gltf) => {
            const scene = gltf.scene;
            this.mixer = new THREE.AnimationMixer(scene);
            this.mixer.clipAction(gltf.animations[0]).play();

            gltf.scene.traverse((child) => {
                if (child.isObject3D) {
                    child.castShadow = true;
                }
            });

            return [scene];
        })
    );

    constructor() {
        injectBeforeRender(({ delta }) => {
            if (this.mixer) {
                this.mixer.update(delta);
            }
        });
    }
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    imports: [NgtCanvas, NgtArgs],
})
export class App {
    readonly scene = Scene;
}
