// const STUDENT_QUIZ_WEBHOOK =
//   "/fusion-api/webhooks/webhook-o1ndy9rgi8ugs6zl58bp4r6n/student-quiz";

// export async function generateQuiz(studentData) {
//   const payload = {
//     fullName: studentData.fullName,
//     age: Number(studentData.age),
//     level: studentData.level,
//   };

//   const response = await fetch(STUDENT_QUIZ_WEBHOOK, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(
//       `Erreur génération quiz (${response.status}) : ${
//         errorText || "réponse invalide"
//       }`
//     );
//   }

//   const data = await response.json();

//   if (!data?.payload) {
//     throw new Error("Payload manquant dans la réponse Fusion");
//   }

//   let parsedPayload;

//   try {
//     parsedPayload = JSON.parse(data.payload);
//   } catch (error) {
//     console.error("Payload reçu:", data.payload);
//     throw new Error("Payload JSON invalide");
//   }

//   if (!parsedPayload?.quiz || !Array.isArray(parsedPayload.quiz)) {
//     throw new Error("Format du quiz invalide");
//   }

//   return parsedPayload;
// }
// const QUIZ_ANALYSIS_WEBHOOK =
//   "/fusion-api/webhooks/webhook-pdj3mx4t2espt841311pjud2/student-quiz-analysis";

// export async function analyzeQuiz(submissionData) {
//   const response = await fetch(QUIZ_ANALYSIS_WEBHOOK, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(submissionData),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(
//       `Erreur analyse quiz (${response.status}) : ${
//         errorText || "réponse invalide"
//       }`
//     );
//   }

//   const data = await response.json();

//   console.log("Analyse brute Fusion:", data);
//   console.log("Payload brut:", data?.payload);

//   if (!data?.payload) {
//     throw new Error("Payload manquant dans la réponse d'analyse");
//   }

//   try {
//     return JSON.parse(data.payload);
//   } catch (error) {
//     console.error("Erreur parse analyse:", error);
//     console.error("Payload invalide reçu:", data.payload);
//     throw new Error("Payload analyse JSON invalide");
//   }
// }