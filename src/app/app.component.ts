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
    template: `
        <ngt-fog *args="['#cccccc', 10, 15]" attach="fog" />
        <ngt-color *args="['#95CFFF']" attach="background" />

        <ngt-point-light [position]="[5, 15, 15]" [castShadow]="true" [intensity]="0.5">
            <ngt-vector2 *args="[1024, 1024]" attach="shadow.mapSize" />
        </ngt-point-light>

        <ngt-mesh [receiveShadow]="true" [rotation]="[-Math.PI / 2, 0, 0]">
            <ngt-plane-geometry *args="[100, 100]" />
            <ngt-shadow-material [transparent]="true" />
        </ngt-mesh>

        <ngt-primitive
            *args="model$ | ngtPush"
            [scale]="0.01"
            [position]="[0, 0.41, 0]"
            [rotation]="[0, -Math.PI / 2, 0]"
        />

        <ngts-environment preset="sunset" />
        <ngts-orbit-controls [autoRotate]="true" [autoRotateSpeed]="0.5" />
    `,
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
    template: `
        <ngt-canvas [sceneGraph]="scene" [camera]="{ position: [-5, 5, 5] }" [shadows]="true" />
    `,
    imports: [NgtCanvas, NgtArgs],
    styles: [],
})
export class AppComponent {
    readonly scene = Scene;
}
