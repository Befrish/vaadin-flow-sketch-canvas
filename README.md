- Inspired by [Vaadin Addon Template](https://github.com/vaadin/addon-template) 
- Inspired by [Canvas Java Addon](https://github.com/parttio/vaadin-flow-canvas)

# Canvas Component with Sketch Feature for Vaadin 23+

This is a Java integration of the HTML5 `<canvas>` for Vaadin.

Currently, this add-on provides a subset of the [client-side JavaScript API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to Java users.

## Usage Example

Add the dependency to your Vaadin 23+ project's `pom.xml`:
```xml
<dependency>
    <groupId>org.vaadin.addon.befrish</groupId>
    <artifactId>sketch-canvas</artifactId>
    <version>1.0.0</version>
</dependency>
```

The API is similar to its client-side counterpart:
```java
SketchCanvas canvas = new SketchCanvas();
canvas.setWidth(500, Unit.PIXELS);
canvas.setHeight(300, Unit.PIXELS);
canvas.setStrokeStyle("blue");
canvas.setLineWidth(10);

canvas.setBase64Image("data:image/png;base64,iVBORw0KGg...");

canvas.getBase64Image().thenAccept(base64Image -> {
  Image image = new Image();
  // Setzen Sie den Base64-String als Bildquelle
  image.setSrc(base64Image);
  image.setWidth(canvas.getWidth());
  image.setHeight(canvas.getHeight());
});
```

More examples can be found in the [demo sources](https://github.com/Befrish/vaadin-flow-sketch-canvas/blob/master/src/test/java/org/vaadin/pekkam/DemoView.java).

## Development Instructions

Starting the test/demo server:
```
mvn jetty:run
```

This deploys the demo at `http://localhost:8080`

## Cutting new release

Before cutting a release, make sure the build passes properly locally and in GitHub Actions based verification build.

To tag a release and increment versions, go the line-awesome subdirectory and issue:

    mvn release:prepare release:clean

Answer questions, defaults most often fine. Note that release:perform is not needed as there is a GitHub Action is set up build and to push release to Maven Central automatically.

Directory will automatically pick up new releases within about half an hour, but if browser or Vaadin version support change, be sure to adjust the metadata in Vaadin Directory UI.
