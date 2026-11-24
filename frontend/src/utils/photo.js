// src/utils/photo.js

// Prend un fichier photo et renvoie une version réduite sous forme de texte
export function reduireImage(fichier, largeurMax = 800) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => reject(new Error('Lecture de la photo impossible'));

    lecteur.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Ce fichier n'est pas une image valide"));

      img.onload = () => {
        // On calcule la taille réduite en gardant les proportions
        const ratio = Math.min(1, largeurMax / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // On dessine la photo réduite, puis on la convertit en texte (JPEG)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = lecteur.result;
    };

    lecteur.readAsDataURL(fichier);
  });
}