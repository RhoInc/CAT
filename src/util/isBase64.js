export default function isBase64(str) {
    try {
        atob(str);
    } catch (e) {
        return false;
    }
    return true;
}
