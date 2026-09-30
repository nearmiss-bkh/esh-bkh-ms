// =====================================================
// NEAR MISS REPORTING SYSTEM
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const form =
    document.getElementById("nearMissForm");

const successMessage =
    document.getElementById("successMessage");

const dateTime =
    document.getElementById("dateTime");

const photoInput =
    document.getElementById("photo");

const photoCount =
    document.getElementById("photoCount");

const videoInput =
    document.getElementById("video");

const videoInfo =
    document.getElementById("videoInfo");


// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";


// =====================================================
// SETTINGS
// =====================================================

const MAX_PHOTOS = 10;

const MAX_PHOTO_SIZE =
    10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
    20 * 1024 * 1024;

const MAX_LOCATION_LENGTH = 500;

const MAX_WIDTH = 1200;

const MAX_HEIGHT = 1200;

const JPEG_QUALITY = 0.75;


// =====================================================
// CONFIRM SCRIPT LOADED
// =====================================================

console.log(
    "NEAR MISS script.js loaded successfully"
);


// =====================================================
// PHOTO COUNTER
// =====================================================

if (photoInput) {

    photoInput.addEventListener(
        "change",
        function () {

            const count =
                photoInput.files.length;


            if (count === 0) {

                if (photoCount) {

                    photoCount.textContent =
                        "No photos selected";

                }

                return;

            }


            if (count > MAX_PHOTOS) {

                if (photoCount) {

                    photoCount.textContent =
                        "❌ Maximum 10 photos allowed";

                }

                return;

            }


            if (photoCount) {

                photoCount.textContent =
                    "📷 " +
                    count +
                    " photo(s) selected";

            }

        }
    );

}


// =====================================================
// VIDEO INFORMATION
// =====================================================

if (videoInput) {

    videoInput.addEventListener(
        "change",
        function () {

            const file =
                videoInput.files[0];


            if (!file) {

                if (videoInfo) {

                    videoInfo.textContent =
                        "No video selected";

                }

                return;

            }


            if (
                !file.type.startsWith("video/")
            ) {

                videoInput.value = "";

                if (videoInfo) {

                    videoInfo.textContent =
                        "❌ Please select a video file.";

                }

                return;

            }


            const sizeMB =
                file.size /
                (1024 * 1024);


            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                videoInput.value = "";

                if (videoInfo) {

                    videoInfo.textContent =
                        "❌ Video is larger than 20 MB.";

                }

                return;

            }


            if (videoInfo) {

                videoInfo.textContent =
                    "🎥 " +
                    file.name +
                    " (" +
                    sizeMB.toFixed(1) +
                    " MB)";

            }


            console.log(
                "Video selected:",
                file.name,
                file.size,
                file.type
            );

        }
    );

}


// =====================================================
// MALAYSIA DATE/TIME
// =====================================================

function setMalaysiaDateTime() {

    if (!dateTime) {

        return;

    }


    const now =
        new Date();


    const malaysiaTime =
        new Date(
            now.toLocaleString(
                "en-US",
                {
                    timeZone:
                        "Asia/Kuala_Lumpur"
                }
            )
        );


    const year =
        malaysiaTime.getFullYear();


    const month =
        String(
            malaysiaTime.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            malaysiaTime.getDate()
        ).padStart(
            2,
            "0"
        );


    const hours =
        String(
            malaysiaTime.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            malaysiaTime.getMinutes()
        ).padStart(
            2,
            "0"
        );


    dateTime.value =
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hours +
        ":" +
        minutes;

}


// =====================================================
// SET DATE/TIME WHEN PAGE LOADS
// =====================================================

setMalaysiaDateTime();


// =====================================================
// UPDATE DATE/TIME EVERY MINUTE
// =====================================================

setInterval(
    setMalaysiaDateTime,
    60000
);


// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressPhoto(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            let width =
                                img.width;

                            let height =
                                img.height;


                            // =================================
                            // RESIZE LARGE IMAGE
                            // =================================

                            if (
                                width >
                                    MAX_WIDTH ||
                                height >
                                    MAX_HEIGHT
                            ) {

                                const ratio =
                                    Math.min(
                                        MAX_WIDTH /
                                            width,
                                        MAX_HEIGHT /
                                            height
                                    );


                                width =
                                    Math.round(
                                        width *
                                        ratio
                                    );


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );

                            }


                            // =================================
                            // CREATE CANVAS
                            // =================================

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            // =================================
                            // COMPRESS TO JPEG
                            // =================================

                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );


                            // =================================
                            // RETURN PHOTO DATA
                            // =================================

                            resolve({

                                data:
                                    compressed.split(
                                        ","
                                    )[1],

                                type:
                                    "image/jpeg",

                                name:
                                    "NearMiss_" +
                                    Date.now() +
                                    "_" +
                                    Math.random()
                                        .toString(36)
                                        .substring(
                                            2,
                                            8
                                        ) +
                                    ".jpg"

                            });

                        };


                    img.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to read image."
                                )
                            );

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read photo."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// READ VIDEO AS BASE64
// =====================================================

function readVideo(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve(null);

                return;

            }


            if (
                !file.type.startsWith("video/")
            ) {

                reject(
                    new Error(
                        "Selected file is not a video."
                    )
                );

                return;

            }


            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                reject(
                    new Error(
                        "Video is larger than 20 MB."
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const result =
                        event.target.result;


                    const commaIndex =
                        result.indexOf(",");


                    if (
                        commaIndex === -1
                    ) {

                        reject(
                            new Error(
                                "Unable to process video."
                            )
                        );

                        return;

                    }


                    const base64 =
                        result.substring(
                            commaIndex + 1
                        );


                    resolve({

                        base64:
                            base64,

                        type:
                            file.type ||
                            "video/mp4",

                        name:
                            file.name ||
                            (
                                "NearMiss_Video_" +
                                Date.now() +
                                ".mp4"
                            )

                    });

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read video."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// GET FORM VALUE SAFELY
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.error(
            "Missing form element:",
            id
        );

        return "";

    }


    return element.value.trim();

}


// =====================================================
// SUBMIT FORM
// =====================================================

if (!form) {

    console.error(
        "ERROR: nearMissForm was not found."
    );

}

else {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();


            console.log(
                "SUBMIT EVENT DETECTED"
            );


            const submitButton =
                form.querySelector(
                    ".submit-button"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "SUBMITTING...";

            }


            if (successMessage) {

                successMessage.style.display =
                    "block";

                successMessage.innerHTML =
                    "<strong>⏳ Preparing report...</strong>";

            }


            try {

                // =========================================
                // GET PHOTOS
                // =========================================

                let photos = [];


                const selectedFiles =
                    photoInput
                        ? photoInput.files
                        : [];


                console.log(
                    "Photos selected:",
                    selectedFiles.length
                );


                if (
                    selectedFiles.length >
                    MAX_PHOTOS
                ) {

                    throw new Error(
                        "Maximum 10 photos allowed."
                    );

                }


                // =========================================
                // PROCESS PHOTOS
                // =========================================

                for (
                    let i = 0;
                    i < selectedFiles.length;
                    i++
                ) {

                    const photo =
                        selectedFiles[i];


                    console.log(
                        "Processing photo:",
                        i + 1,
                        photo.name,
                        photo.size,
                        photo.type
                    );


                    if (
                        photo.size >
                        MAX_PHOTO_SIZE
                    ) {

                        throw new Error(
                            "Photo " +
                            (i + 1) +
                            " is larger than 10 MB."
                        );

                    }


                    if (successMessage) {

                        successMessage.innerHTML =
                            "<strong>📷 Processing photo " +
                            (i + 1) +
                            " of " +
                            selectedFiles.length +
                            "...</strong>";

                    }


                    const compressed =
                        await compressPhoto(
                            photo
                        );


                    photos.push({

                        base64:
                            compressed.data,

                        name:
                            compressed.name,

                        type:
                            compressed.type

                    });


                    console.log(
                        "Photo processed:",
                        i + 1,
                        "Base64 length:",
                        compressed.data.length
                    );

                }


                console.log(
                    "TOTAL PHOTOS PROCESSED:",
                    photos.length
                );


                // =========================================
                // PROCESS VIDEO
                // =========================================

                let video = null;


                if (
                    videoInput &&
                    videoInput.files &&
                    videoInput.files.length > 0
                ) {

                    const selectedVideo =
                        videoInput.files[0];


                    console.log(
                        "Video selected:",
                        selectedVideo.name,
                        selectedVideo.size,
                        selectedVideo.type
                    );


                    if (
                        !selectedVideo.type.startsWith(
                            "video/"
                        )
                    ) {

                        throw new Error(
                            "Selected file is not a video."
                        );

                    }


                    if (
                        selectedVideo.size >
                        MAX_VIDEO_SIZE
                    ) {

                        throw new Error(
                            "Video is larger than 20 MB."
                        );

                    }


                    if (successMessage) {

                        successMessage.innerHTML =
                            "<strong>🎥 Processing video...</strong>";

                    }


                    video =
                        await readVideo(
                            selectedVideo
                        );


                    console.log(
                        "Video processed successfully"
                    );


                    console.log(
                        "Video Base64 length:",
                        video && video.base64
                            ? video.base64.length
                            : 0
                    );

                }


                // =========================================
                // CREATE REPORT OBJECT
                // =========================================

                const report = {

                    action:
                        "saveReport",

                    dateTime:
                        getValue(
                            "dateTime"
                        ),

                    location:
                        getValue(
                            "location"
                        ).substring(
                            0,
                            MAX_LOCATION_LENGTH
                        ),

                    department:
                        getValue(
                            "department"
                        ),

                    hazardCategory:
                        getValue(
                            "hazardCategory"
                        ),

                    whatHappened:
                        getValue(
                            "whatHappened"
                        ),

                    reporterName:
                        getValue(
                            "reporterName"
                        ),

                    photos:
                        photos,

                    video:
                        video,

                    status:
                        "New",

                    submittedAt:
                        new Date().toISOString()

                };


                console.log(
                    "REPORT READY FULL:",
                    JSON.stringify(
                        report
                    )
                );


                // =========================================
                // SEND REPORT
                // =========================================

                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>☁️ Sending report...</strong>";

                }


                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {

                            method:
                                "POST",

                            redirect:
                                "follow",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    report
                                )

                        }
                    );


                console.log(
                    "SERVER STATUS:",
                    response.status
                );


                const responseText =
                    await response.text();


                console.log(
                    "SERVER RESPONSE:",
                    responseText
                );


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }

                catch (jsonError) {

                    console.error(
                        "JSON ERROR:",
                        jsonError
                    );


                    throw new Error(
                        "Server did not return valid JSON."
                    );

                }


                if (
                    !result ||
                    result.success !== true
                ) {

                    throw new Error(
                        result.error ||
                        result.message ||
                        "Report was not accepted by the server."
                    );

                }


                const assignedReportNumber =
                    result.reportNumber;


                console.log(
                    "SERVER ASSIGNED REPORT NUMBER:",
                    assignedReportNumber
                );


                console.log(
                    "SERVER SAVED PHOTOS:",
                    result.photos
                );


                console.log(
                    "SERVER SAVED VIDEO:",
                    result.video
                );


                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>✅ Report submitted successfully!</strong>" +
                        "<br><br>" +
                        "Report No: <strong>" +
                        (
                            assignedReportNumber ||
                            "Assigned by system"
                        ) +
                        "</strong>" +
                        "<br><br>" +
                        "📷 Photos uploaded: <strong>" +
                        photos.length +
                        "</strong>" +
                        "<br><br>" +
                        "🎥 Video uploaded: <strong>" +
                        (
                            video
                                ? "Yes"
                                : "No"
                        ) +
                        "</strong>" +
                        "<br><br>" +
                        "Your report has been recorded.";

                }


                console.log(
                    "REPORT SUBMITTED SUCCESSFULLY:",
                    assignedReportNumber
                );


                form.reset();


                if (photoCount) {

                    photoCount.textContent =
                        "No photos selected";

                }


                if (videoInfo) {

                    videoInfo.textContent =
                        "No video selected";

                }


                setMalaysiaDateTime();

            }


            catch (error) {

                console.error(
                    "SUBMISSION ERROR:",
                    error
                );


                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>❌ Unable to submit report.</strong>" +
                        "<br><br>" +
                        error.message +
                        "<br><br>" +
                        "Your information has NOT been cleared. " +
                        "Please try again.";

                }

            }


            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "SUBMIT NEAR MISS";

                }

            }

        }
    );

}


// =====================================================
// CORRECTIVE ACTION PHOTO UPLOAD
// =====================================================
//
// IMPORTANT
//
// This function matches the current Code.gs:
//
// uploadCorrectivePhoto(data)
//
// Backend expects:
//
// {
//     action: "uploadCorrectivePhoto",
//     reportNumber: "...",
//     photo: {
//         base64: "...",
//         type: "...",
//         name: "..."
//     }
// }
//
// =====================================================

async function uploadCorrectiveActionPhoto(
    reportNumber,
    file
) {

    console.log(
        "=========================================="
    );

    console.log(
        "CORRECTIVE ACTION PHOTO UPLOAD START"
    );

    console.log(
        "Report Number:",
        reportNumber
    );

    console.log(
        "File:",
        file
    );


    // =================================================
    // CHECK REPORT NUMBER
    // =================================================

    if (
        !reportNumber ||
        String(reportNumber).trim() === ""
    ) {

        throw new Error(
            "Report Number Required."
        );

    }


    reportNumber =
        String(
            reportNumber
        ).trim();


    // =================================================
    // CHECK FILE
    // =================================================

    if (!file) {

        throw new Error(
            "Please select a corrective action photo."
        );

    }


    // =================================================
    // CHECK IMAGE TYPE
    // =================================================

    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "Please select an image file."
        );

    }


    // =================================================
    // CHECK FILE SIZE
    // =================================================

    if (
        file.size >
        MAX_PHOTO_SIZE
    ) {

        throw new Error(
            "Corrective action photo is larger than 10 MB."
        );

    }


    console.log(
        "Corrective photo selected:",
        file.name,
        file.size,
        file.type
    );


    // =================================================
    // COMPRESS PHOTO
    // =================================================

    console.log(
        "Compressing corrective action photo..."
    );


    const compressed =
        await compressPhoto(
            file
        );


    console.log(
        "Corrective photo compressed."
    );


    console.log(
        "Base64 length:",
        compressed.data
            ? compressed.data.length
            : 0
    );


    // =================================================
    // IMPORTANT
    //
    // Code.gs expects:
    //
    // data.photo.base64
    //
    // NOT:
    //
    // data.photo.data
    //
    // =================================================

    const payload = {

        action:
            "uploadCorrectivePhoto",

        reportNumber:
            reportNumber,

        photo: {

            base64:
                compressed.data,

            type:
                compressed.type,

            name:
                compressed.name

        }

    };


    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "CORRECTIVE PHOTO PAYLOAD:",
        {

            action:
                payload.action,

            reportNumber:
                payload.reportNumber,

            photoName:
                payload.photo.name,

            photoType:
                payload.photo.type,

            base64Length:
                payload.photo.base64
                    ? payload.photo.base64.length
                    : 0

        }
    );


    // =================================================
    // CHECK BASE64 BEFORE SENDING
    // =================================================

    if (
        !payload.photo ||
        !payload.photo.base64
    ) {

        throw new Error(
            "Corrective photo Base64 data is empty."
        );

    }


    // =================================================
    // SEND TO GOOGLE APPS SCRIPT
    // =================================================

    console.log(
        "Sending corrective action photo..."
    );


    const response =
        await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method:
                    "POST",

                redirect:
                    "follow",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    console.log(
        "CORRECTIVE PHOTO SERVER STATUS:",
        response.status
    );


    // =================================================
    // READ RESPONSE
    // =================================================

    const responseText =
        await response.text();


    console.log(
        "CORRECTIVE PHOTO SERVER RESPONSE:",
        responseText
    );


    // =================================================
    // PARSE RESPONSE
    // =================================================

    let result;


    try {

        result =
            JSON.parse(
                responseText
            );

    }

    catch (error) {

        console.error(
            "Corrective photo JSON error:",
            error
        );


        throw new Error(
            "Server did not return valid JSON."
        );

    }


    // =================================================
    // CHECK RESULT
    // =================================================

    if (
        !result ||
        result.success !== true
    ) {

        throw new Error(
            result.error ||
            result.message ||
            "Corrective action photo upload failed."
        );

    }


    // =================================================
    // SUCCESS
    // =================================================

    console.log(
        "=========================================="
    );

    console.log(
        "CORRECTIVE ACTION PHOTO UPLOADED"
    );

    console.log(
        "Report Number:",
        reportNumber
    );

    console.log(
        "Photo URL:",
        result.photoUrl
    );

    console.log(
        "Row Number:",
        result.rowNumber
    );

    console.log(
        "=========================================="
    );


    return result;

}


// =====================================================
// ALIAS
// =====================================================
//
// This allows your Dashboard to call either:
//
// uploadCorrectiveActionPhoto()
// or
// uploadCorrectivePhoto()
//
// =====================================================

async function uploadCorrectivePhoto(
    reportNumber,
    file
) {

    return await uploadCorrectiveActionPhoto(
        reportNumber,
        file
    );

}


// =====================================================
// HELPER:
// UPLOAD CORRECTIVE PHOTO FROM INPUT
// =====================================================
//
// Example:
//
// uploadCorrectivePhotoFromInput(
//     "NM-2026-0001",
//     "correctivePhoto"
// );
//
// =====================================================

async function uploadCorrectivePhotoFromInput(
    reportNumber,
    inputId
) {

    try {

        const input =
            document.getElementById(
                inputId
            );


        if (!input) {

            throw new Error(
                "Corrective action photo input was not found."
            );

        }


        if (
            !input.files ||
            input.files.length === 0
        ) {

            throw new Error(
                "Please select a corrective action photo."
            );

        }


        const file =
            input.files[0];


        const result =
            await uploadCorrectiveActionPhoto(
                reportNumber,
                file
            );


        console.log(
            "Corrective action photo uploaded successfully:",
            result
        );


        return result;

    }


    catch (error) {

        console.error(
            "CORRECTIVE PHOTO UPLOAD ERROR:",
            error
        );


        throw error;

    }

}


// =====================================================
// END OF SCRIPT
// =====================================================

console.log(
    "NEAR MISS REPORTING SYSTEM READY"
);

console.log(
    "Corrective action photo uploader ready."
);
