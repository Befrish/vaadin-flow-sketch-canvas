package org.vaadin.befrish.sketchcanvas;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.HasStyle;
import com.vaadin.flow.component.PropertyDescriptor;
import com.vaadin.flow.component.PropertyDescriptors;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;

import java.io.Serializable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

/**
 * Canvas component that you can draw shapes and images on. It's a Java wrapper
 * for the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">HTML5
 * canvas</a>.
 * <p>
 */
@Tag("sketch-canvas")
@JsModule("./sketch-canvas.js")
@SuppressWarnings("serial")
public class SketchCanvas extends Component implements HasStyle, HasSize {

    @Override
    public void setWidth(final String width) {
        HasSize.super.setWidth(width);
        updateCanvaSize();
    }

    @Override
    public void setHeight(final String height) {
        HasSize.super.setHeight(height);
        updateCanvaSize();
    }

    @Override
    public void setSizeFull() {
        HasSize.super.setSizeFull();
        updateCanvaSize();
    }

    /**
     * Sicherstellen, dass die Größe des Canvas aktualisiert wird.
     */
    private void updateCanvaSize() {
        getElement().executeJs("this._updateCanvasSize();");
    }

    public String getStrokeStyle() {
        return getElement().getAttribute("stroke-style");
    }

    public void setStrokeStyle(final String strokeStyle) {
        getElement().setAttribute("stroke-style", strokeStyle);
    }

    public int getLineWidth() {
        return Integer.parseInt(getElement().getAttribute("line-width"));
    }

    public void setLineWidth(final int lineWidth) {
        getElement().setAttribute("line-width", Integer.toString(lineWidth));
    }

    public String getLineCap() {
        return getElement().getAttribute("line-cap");
    }

    public void setLineCap(final String lineCap) {
        getElement().setAttribute("line-cap", lineCap);
    }

    public String getLineJoin() {
        return getElement().getAttribute("line-join");
    }

    public void setLineJoin(final String lineJoin) {
        getElement().setAttribute("line-join", lineJoin);
    }

    public CompletableFuture<String> getBase64Image() {
        return getElement().callJsFunction("getBase64Image").toCompletableFuture(String.class);
    }

    public void setBase64Image(final String base64Image) {
        getElement().callJsFunction("setBase64Image", base64Image);
    }

    public void clear() {
        getElement().callJsFunction("clear");
    }

}
