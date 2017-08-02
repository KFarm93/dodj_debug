const drawObject = (context, obj) => {
  context.save();
  context.translate(obj.position.x, obj.position.y);
  context.fillStyle = obj.color;
  context.fillRect(-obj.size.width / 2, -obj.size.height / 2,
      obj.size.width, obj.size.height);
  context.restore();
  context.globalAlpha = 1.0;
}
