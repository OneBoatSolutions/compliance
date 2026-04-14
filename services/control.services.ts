import { mockControls } from "./mockData";


export async function saveControl(data: any) {
  console.log("Saving control:", data);

  // later your teammate replaces this
  return new Promise((resolve) => setTimeout(resolve, 1000));
}


export async function getControl(controlId: string) {
  // simulate API delay
  await new Promise((res) => setTimeout(res, 300));

  return mockControls[controlId] || mockControls["test"];
}