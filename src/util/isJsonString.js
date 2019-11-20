export default function isJsonString(str) {
    try {
        JSON5.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
