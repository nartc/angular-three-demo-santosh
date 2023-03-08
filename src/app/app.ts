import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend, NgtArgs, NgtCanvas, NgtPush } from 'angular-three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import { injectNgtsGLTFLoader } from 'angular-three-soba/loaders';
import { injectNgtsAnimations } from 'angular-three-soba/misc';
import { NgtsEnvironment, NgtsFloat } from 'angular-three-soba/staging';
import { map } from 'rxjs';
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

    private readonly gltf$ = injectNgtsGLTFLoader('assets/scene.gltf');

    readonly model$ = this.gltf$.pipe(
        map((gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isObject3D) child.castShadow = true;
            });

            return [gltf.scene];
        })
    );

    constructor() {
        injectNgtsAnimations(this.gltf$);
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
