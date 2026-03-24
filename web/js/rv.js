import { app } from "../../../scripts/app.js";
import {api} from "../../../scripts/api.js";

console.log("TESTINGGGGGGGGG IF THIS IS PRINTINGGGGG");

app.registerExtension({
    name: "OpenInRV",

    async nodeCreated(node) {
        // Target video output nodes — adjust type names to match your setup
        const VIDEO_NODE_TYPES = [
            "VHS_VideoCombine",   // VideoHelperSuite
        ];

        if (!VIDEO_NODE_TYPES.includes(node.comfyClass)) return;


        // Store original getExtraMenuOptions if it exists
        const origGetExtraMenuOptions = node.getExtraMenuOptions?.bind(node);

        node.getExtraMenuOptions = function (_, options) {
            // Preserve existing options (like "Open Preview")
            if (origGetExtraMenuOptions) origGetExtraMenuOptions(_, options);

            options.push({
                content: "Open in RV",
                callback: () => {
                    // Find the output video file path from the node's output data
                    // const filename_prefix_widget = this.widgets.find(w => w.name === "filename_prefix");
                    // const filename = filename_prefix_widget._value;
                    // const full_path = output_path + filename;
                    // console.log(full_path);

                    const previewWidget = this.widgets.find(w => w.name === "videopreview");
                    const fullpath = previewWidget.value.params.fullpath;
                    console.log(fullpath); 

                    // Call the backend to launch OpenRV with the file
                    fetch("/open_in_rv", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: fullpath }),
                    }).catch(err => console.error("[OpenInRV] Failed to open in RV:", err));
                },
            });
        };
    },
});

