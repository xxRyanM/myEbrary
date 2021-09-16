FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 1 / .75,
    imageResizeTargetWidth: 300,
    imageResizeTargetHeight: 300 / 0.75
})

FilePond.parse(document.body);