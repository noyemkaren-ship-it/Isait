import { appendFile } from 'node:fs/promises';

export async function writeToFile(filePath: string, text: string) {
    try {
        const readableTime: string = new Date().toLocaleTimeString(); 
        await appendFile(filePath, readableTime + text + '\n', 'utf8');
        console.log('Данные успешно добавлены в файл.');
    } catch (error) {
        console.error('Ошибка при записи файла:', error);
    }
}