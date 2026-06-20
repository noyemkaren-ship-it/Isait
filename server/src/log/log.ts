

export async function print(text: any) {
    await new Promise(resolve => setTimeout(resolve, 0));
    console.log(text);
}