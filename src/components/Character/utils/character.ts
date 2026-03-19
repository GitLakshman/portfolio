import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc?v=2",
          "MyCharacter12",
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;

                // Change clothing colors to match site theme
                if (mesh.material) {
                  if (mesh.name === "BODY.SHIRT") {
                    // The shirt mesh
                    const newMat = (
                      mesh.material as THREE.Material
                    ).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#8B4513");
                    mesh.material = newMat;
                  } else if (mesh.name === "Pant") {
                    const newMat = (
                      mesh.material as THREE.Material
                    ).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#000000");
                    mesh.material = newMat;
                  } else if (mesh.name === "Face.002" || mesh.name === "Face" || mesh.name === "Face.001") {
                    // Change face style (slightly warmer tone and more animated/stylized look)
                    const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
                    newMat.color = new THREE.Color("#f5d0b5"); // Stylized face tint slightly warmer
                    newMat.roughness = 0.4;
                    // Provide a cleaner cel-style untextured look if needed, but keeping texture and tinting it is safer
                    mesh.material = newMat;
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            // Add spectacles to the head bone
            const headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006") || character.getObjectByName("Head");
            console.log("Found headBone:", headBone?.name);
            if (headBone) {
              const glassesGroup = new THREE.Group();
              glassesGroup.name = "MyGlasses";
              
              const frameMat = new THREE.MeshStandardMaterial({ 
                color: 0x111111, 
                roughness: 0.1, 
                metalness: 0.8 
              });
              const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0,
                roughness: 0.05,
                transmission: 0.9,
                transparent: true,
                opacity: 0.2,
                ior: 1.5,
              });

              // Tuned sizes relative to the face
              const r = 0.28;    // Lens radius
              const t = 0.02;    // Thin Frame thickness
              const ox = 0.35;   // Eye offset X
              const y = 1.4;     // Offset Y (up from neck)
              const z = 0.9;     // Offset Z (forward from neck)
              
              const leftFrame = new THREE.Mesh(new THREE.TorusGeometry(r, t, 16, 64), frameMat);
              leftFrame.position.set(ox, y, z);
              // Counteract any potential vertical squish from bone matrix by slightly scaling Y
              // if not squished, this makes them slightly oval which is fine
              leftFrame.scale.set(1, 1.2, 1);
              const rightFrame = leftFrame.clone();
              rightFrame.position.set(-ox, y, z);
              
              const leftLens = new THREE.Mesh(new THREE.CircleGeometry(r - t / 2, 32), glassMat);
              leftLens.position.copy(leftFrame.position);
              leftLens.scale.copy(leftFrame.scale);
              const rightLens = leftLens.clone();
              rightLens.position.copy(rightFrame.position);

              const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, ox * 2), frameMat);
              bridge.rotation.z = Math.PI / 2;
              bridge.position.set(0, y, z);

              const armLength = 1.0;
              const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, armLength), frameMat);
              leftArm.rotation.x = Math.PI / 2;
              leftArm.position.set(ox + r, y, z - armLength / 2);
              
              const rightArm = leftArm.clone();
              rightArm.position.set(-ox - r, y, z - armLength / 2);
              
              glassesGroup.add(leftFrame, rightFrame, leftLens, rightLens, bridge, leftArm, rightArm);
              
              // Base scale 1 
              glassesGroup.scale.set(1, 1, 1); 
              headBone.add(glassesGroup);
            }
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          },
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
