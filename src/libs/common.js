let TextToImageUrl = (text, backgroundColor = "#605CA8", color = "#F7F7F9") => {
    if (!text) {
        return;
    }
    let canvas = document.createElement("canvas");
    let fontSize = 60;
    canvas.width = 120;
    canvas.height = 120;
    var context = canvas.getContext("2d");
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.font = `bold ${fontSize}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text.charAt(0), fontSize, fontSize);
    return canvas.toDataURL("image/png");
};

export { TextToImageUrl };
