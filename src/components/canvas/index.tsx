"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

/**
 * threejs cansvas
 * @returns
 */
export const CanvasComp = () => {
  const ref = useRef<HTMLDivElement>(null);
  const renderer = useMemo(() => new WebGLRenderer(), []);

  const [axis] = useState(() => new AxesHelper(50)); // xyz 기준축 헬퍼
  const scene = useMemo(() => new Scene(), []);

  const camera = useMemo(
    () =>
      new PerspectiveCamera(
        75, // 시야각 (fav)
        window.innerWidth / window.innerHeight, // 종횡비 (aspect)
        0.1, // near 절단면
        1000 // far 절단면
      ),
    []
  );

  /**
   * 화면 제어 컨트롤러
   * @notice camera.position 세팅 후 .update() 해줘야 동작
   */
  const controls = useMemo(
    () => new OrbitControls(camera, renderer.domElement),
    [camera, renderer]
  );

  /**
   *
   */
  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    controls.update();

    renderer.render(scene, camera);
  }, [renderer, scene, camera, controls]);

  useEffect(() => {
    axis.position.set(-100, 1, -50);

    scene.add(axis);
    scene.add(new AmbientLight("white"));

    const gridHelper = new GridHelper(200, 20, "yellow", "white");
    gridHelper.position.set(0, 1, 50);
    scene.add(gridHelper);

    renderer.setSize(window.innerWidth, window.innerHeight);

    ref.current?.appendChild(renderer.domElement);

    camera!.position.set(-50, 120, 100);
    camera!.lookAt(0.1, 5, 0);
    animate();
  }, [renderer, ref, scene, camera, animate, axis]);

  useLayoutEffect(() => {
    const geom = new BoxGeometry(200, 2, 100);
    const material = new MeshBasicMaterial({
      color: "gray",
      clipShadows: true,
    });

    const ground = new Mesh(geom, material);

    scene.add(ground);
  }, [ref, renderer, camera, scene]);

  return (
    <>
      <div ref={ref} className="w-full h-full"></div>
    </>
  );
};
