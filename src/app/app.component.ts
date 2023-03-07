import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { extend, NgtArgs, NgtCanvas } from 'angular-three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import * as THREE from 'three';
import { Mesh } from 'three';

extend(THREE);

@Component({
    selector: 'app-box',
    standalone: true,
    template: `
        <ngt-mesh #mesh (beforeRender)="onBeforeRender($any(mesh))" [position]="position">
            <ngt-box-geometry />
            <ngt-mesh-standard-material />
        </ngt-mesh>

        <ng-container *ngIf="showHelper">
            <ngt-box-helper #boxHelper *args="[mesh, 'darkred']" />
        </ng-container>
    `,
    imports: [NgtArgs, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
    @Input() showHelper = false;
    @Input() position = [0, 0, 0];

    @ViewChild('boxHelper') boxHelper?: ElementRef<THREE.BoxHelper>;

    onBeforeRender(mesh: Mesh) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;

        if (this.boxHelper) {
            this.boxHelper.nativeElement.update();
        }
    }
}

@Component({
    standalone: true,
    template: `
        <ngt-spot-light #spotLight [position]="5" />
        <ngt-spot-light-helper *args="[spotLight, 'red']" />

        <ngt-point-light #pointLight [position]="-5" />
        <ngt-point-light-helper *args="[pointLight, 2, 'blue']" />

        <app-box [position]="[-1.5, 0, 0]" />
        <app-box [showHelper]="true" [position]="[1.5, 0, 0]" />

        <ngts-orbit-controls />
    `,
    imports: [NgtArgs, Box, NgtsOrbitControls],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
        <ngt-canvas [sceneGraph]="scene" [camera]="{ position: [-5, 5, 5] }" />
    `,
    imports: [NgtCanvas],
})
export class AppComponent {
    readonly scene = Scene;
}
