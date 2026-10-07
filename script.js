// =====================================================
// BKH ESH SAFETY REPORTING PORTAL
// =====================================================
// Worker Safety Reporting Form
//
// Supports:
// - Near Miss
// - Unsafe Act
// - Unsafe Condition
// - Accident
// - Property Damage
//
// Google Apps Script Backend:
// saveReport
//
// Also supports:
// uploadCorrectivePhoto
// =====================================================



// =====================================================
// GET HTML ELEMENTS
// =====================================================

const form =
    document.getElementById(
        "nearMissForm"
    );

const successMessage =
    document.getElementById(
        "successMessage"
    );

const dateTime =
    document.getElementById(
        "dateTime"
    );

const photoInput =
    document.getElementById(
        "photo"
    );

const photoCount =
    document.getElementById(
        "photoCount"
    );

const videoInput =
    document.getElementById(
        "video"
    );

const videoInfo =
    document.getElementById(
        "videoInfo"
    );

const videoPreview =
    document.getElementById(
        "videoPreview"
    );

const videoPlayer =
    document.getElementById(
        "videoPlayer"
    );

const photoPreview =
    document.getElementById(
        "photoPreview"
    );



// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";



// =====================================================
// SETTINGS
// =====================================================

const MAX_PHOTOS =
    10;

const MAX_PHOTO_SIZE =
    10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
    20 * 1024 * 1024;

const MAX_LOCATION_LENGTH =
    500;

const MAX_DESCRIPTION_LENGTH =
    5000;

const MAX_REPORTER_NAME_LENGTH =
    150;

const MAX_WIDTH =
    1200;

const MAX_HEIGHT =
    1200;

const JPEG_QUALITY =
    0.75;



// =====================================================
// APPROVED DEPARTMENTS
// =====================================================

const VALID_DEPARTMENTS = [

    "Office",

    "Old Production",

    "New Production",

    "QA/QC",

    "RMS/FGS/WIP",

    "Engineering",

    "Security",

    "Contractor",

    "Visitor"

];



// =====================================================
// APPROVED HAZARD CATEGORIES
// =====================================================

const VALID_HAZARD_CATEGORIES = [

    "Near Miss",

    "Unsafe Act",

    "Unsafe Condition",

    "Accident",

    "Property Damage"

];



// =====================================================
// CONFIRM SCRIPT LOADED
// =====================================================

console.log(
    "BKH ESH Safety Reporting Portal script.js loaded successfully."
);



// =====================================================
// MALAYSIA DATE/TIME
// =====================================================

function setMalaysiaDateTime() {

    if (!dateTime) {

        return;

    }


    try {

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


    catch (error) {

        console.error(
            "Unable to set Malaysia date/time:",
            error
        );

    }

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
// GET FORM VALUE SAFELY
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        console.error(
            "Missing form element:",
            id
        );

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}



// =====================================================
// SHOW STATUS MESSAGE
// =====================================================

function showStatus(
    message,
    type = "info"
) {

    if (!successMessage) {

        return;

    }


    successMessage.style.display =
        "block";


    successMessage.innerHTML =
        message;


    if (type === "error") {

        successMessage.style.background =
            "#fff1f2";

        successMessage.style.borderColor =
            "#fecdd3";

        successMessage.style.color =
            "#b42318";

    }

    else if (type === "success") {

        successMessage.style.background =
            "#ecfdf5";

        successMessage.style.borderColor =
            "#b7ebd2";

        successMessage.style.color =
            "#087443";

    }

    else {

        successMessage.style.background =
            "#f5f8fc";

        successMessage.style.borderColor =
            "#e1e7ef";

        successMessage.style.color =
            "#52627a";

    }

}



// =====================================================
// VALIDATE FORM VALUES
// =====================================================

function validateFormValues() {

    const location =
        getValue(
            "location"
        );

    const department =
        getValue(
            "department"
        );

    const hazardCategory =
        getValue(
            "hazardCategory"
        );

    const whatHappened =
        getValue(
            "whatHappened"
        );

    const reporterName =
        getValue(
            "reporterName"
        );


    // =================================================
    // DATE/TIME
    // =================================================

    if (
        !getValue(
            "dateTime"
        )
    ) {

        throw new Error(
            "Date and time are required."
        );

    }


    // =================================================
    // LOCATION
    // =================================================

    if (!location) {

        throw new Error(
            "Please enter the location."
        );

    }


    if (
        location.length >
        MAX_LOCATION_LENGTH
    ) {

        throw new Error(
            "Location is too long. Please keep it within 500 characters."
        );

    }


    // =================================================
    // DEPARTMENT
    // =================================================

    if (!department) {

        throw new Error(
            "Please select a department."
        );

    }


    if (
        !VALID_DEPARTMENTS.includes(
            department
        )
    ) {

        throw new Error(
            "Invalid department selected."
        );

    }


    // =================================================
    // HAZARD CATEGORY
    // =================================================

    if (!hazardCategory) {

        throw new Error(
            "Please select a hazard category."
        );

    }


    if (
        !VALID_HAZARD_CATEGORIES.includes(
            hazardCategory
        )
    ) {

        throw new Error(
            "Invalid hazard category selected."
        );

    }


    // =================================================
    // DESCRIPTION
    // =================================================

    if (!whatHappened) {

        throw new Error(
            "Please describe what happened."
        );

    }


    if (
        whatHappened.length >
        MAX_DESCRIPTION_LENGTH
    ) {

        throw new Error(
            "Description is too long. Please keep it within 5,000 characters."
        );

    }


    // =================================================
    // REPORTER NAME
    // =================================================

    if (!reporterName) {

        throw new Error(
            "Please enter the reporter name."
        );

    }


    if (
        reporterName.length >
        MAX_REPORTER_NAME_LENGTH
    ) {

        throw new Error(
            "Reporter name is too long."
        );

    }


    return {

        dateTime:
            getValue(
                "dateTime"
            ),

        location:
            location,

        department:
            department,

        hazardCategory:
            hazardCategory,

        whatHappened:
            whatHappened,

        reporterName:
            reporterName

    };

}



// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressPhoto(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                reject(
                    new Error(
                        "Photo file is missing."
                    )
                );

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                reject(
                    new Error(
                        "Selected file is not a valid image."
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (
                    event
                ) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            try {

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


                                if (!context) {

                                    throw new Error(
                                        "Unable to create image processing canvas."
                                    );

                                }


                                // =================================
                                // WHITE BACKGROUND
                                // =================================

                                context.fillStyle =
                                    "#ffffff";


                                context.fillRect(
                                    0,
                                    0,
                                    width,
                                    height
                                );


                                // =================================
                                // DRAW IMAGE
                                // =================================

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


                                if (
                                    !compressed ||
                                    compressed.indexOf(
                                        ","
                                    ) === -1
                                ) {

                                    throw new Error(
                                        "Unable to compress image."
                                    );

                                }


                                const base64 =
                                    compressed.split(
                                        ","
                                    )[1];


                                // =================================
                                // CREATE SAFE FILE NAME
                                // =================================

                                const originalName =
                                    String(
                                        file.name ||
                                        "Photo"
                                    )
                                    .replace(
                                        /\.[^/.]+$/,
                                        ""
                                    )
                                    .replace(
                                        /[^a-zA-Z0-9_-]/g,
                                        "_"
                                    );


                                const newName =
                                    "BKH_ESH_" +
                                    originalName +
                                    "_" +
                                    Date.now() +
                                    "_" +
                                    Math.random()
                                        .toString(
                                            36
                                        )
                                        .substring(
                                            2,
                                            8
                                        ) +
                                    ".jpg";


                                resolve({

                                    data:
                                        base64,

                                    type:
                                        "image/jpeg",

                                    name:
                                        newName

                                });

                            }


                            catch (error) {

                                reject(
                                    error
                                );

                            }

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


            reader.readAsDataURL(
                file
            );

        }
    );

}



// =====================================================
// READ VIDEO AS BASE64
// =====================================================

function readVideo(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                resolve(
                    null
                );

                return;

            }


            // =============================================
            // VIDEO TYPE
            // =============================================

            if (
                !file.type ||
                !file.type.startsWith(
                    "video/"
                )
            ) {

                reject(
                    new Error(
                        "Selected file is not a video."
                    )
                );

                return;

            }


            // =============================================
            // VIDEO SIZE
            // =============================================

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


            // =============================================
            // FILE READER
            // =============================================

            const reader =
                new FileReader();


            reader.onload =
                function (
                    event
                ) {

                    try {

                        const result =
                            event.target.result;


                        if (
                            !result ||
                            typeof result !==
                                "string"
                        ) {

                            throw new Error(
                                "Unable to process video."
                            );

                        }


                        const commaIndex =
                            result.indexOf(
                                ","
                            );


                        if (
                            commaIndex === -1
                        ) {

                            throw new Error(
                                "Unable to process video data."
                            );

                        }


                        const base64 =
                            result.substring(
                                commaIndex + 1
                            );


                        if (!base64) {

                            throw new Error(
                                "Video data is empty."
                            );

                        }


                        resolve({

                            base64:
                                base64,

                            type:
                                file.type ||
                                "video/mp4",

                            name:
                                file.name ||
                                (
                                    "BKH_ESH_Video_" +
                                    Date.now() +
                                    ".mp4"
                                )

                        });

                    }


                    catch (error) {

                        reject(
                            error
                        );

                    }

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read video."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}



// =====================================================
// CLEAN FILE PREVIEWS
// =====================================================

function clearFilePreviews() {

    // =================================================
    // PHOTO COUNT
    // =================================================

    if (photoCount) {

        photoCount.textContent =
            "No photos selected";

    }


    // =================================================
    // PHOTO PREVIEW
    // =================================================

    if (photoPreview) {

        photoPreview.innerHTML =
            "";

    }


    // =================================================
    // VIDEO INFO
    // =================================================

    if (videoInfo) {

        videoInfo.textContent =
            "No video selected";

    }


    // =================================================
    // VIDEO PLAYER
    // =================================================

    if (videoPlayer) {

        try {

            videoPlayer.pause();

        }

        catch (error) {

            console.warn(
                "Video pause warning:",
                error
            );

        }


        videoPlayer.removeAttribute(
            "src"
        );

        videoPlayer.load();

    }


    // =================================================
    // VIDEO PREVIEW
    // =================================================

    if (videoPreview) {

        videoPreview.style.display =
            "none";

    }

}



// =====================================================
// CLEAR SUCCESS MESSAGE
// =====================================================

function hideStatus() {

    if (!successMessage) {

        return;

    }


    successMessage.style.display =
        "none";

    successMessage.innerHTML =
        "";

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
        async function (
            event
        ) {

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "BKH ESH SAFETY REPORT SUBMISSION START"
            );

            console.log(
                "=========================================="
            );


            const submitButton =
                form.querySelector(
                    ".submit-button"
                );


            // =============================================
            // DISABLE BUTTON
            // =============================================

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "SUBMITTING...";

            }


            try {

                // =========================================
                // VALIDATE FORM
                // =========================================

                const formData =
                    validateFormValues();


                console.log(
                    "Form validation passed."
                );


                // =========================================
                // GET PHOTOS
                // =========================================

                let photos = [];


                const selectedFiles =
                    photoInput &&
                    photoInput.files
                        ? photoInput.files
                        : [];


                console.log(
                    "Photos selected:",
                    selectedFiles.length
                );


                // =========================================
                // PHOTO COUNT
                // =========================================

                if (
                    selectedFiles.length >
                    MAX_PHOTOS
                ) {

                    throw new Error(
                        "Maximum 10 photos are allowed."
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


                    // =====================================
                    // CHECK IMAGE TYPE
                    // =====================================

                    if (
                        !photo.type ||
                        !photo.type.startsWith(
                            "image/"
                        )
                    ) {

                        throw new Error(
                            "Photo " +
                            (i + 1) +
                            " is not a valid image."
                        );

                    }


                    // =====================================
                    // CHECK ORIGINAL FILE SIZE
                    // =====================================

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


                    // =====================================
                    // SHOW PROGRESS
                    // =====================================

                    showStatus(
                        "<strong>📷 Processing photo " +
                        (i + 1) +
                        " of " +
                        selectedFiles.length +
                        "...</strong>",
                        "info"
                    );


                    // =====================================
                    // COMPRESS
                    // =====================================

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
                        "Photo processed successfully:",
                        i + 1
                    );

                }


                console.log(
                    "TOTAL PHOTOS PROCESSED:",
                    photos.length
                );



                // =========================================
                // PROCESS VIDEO
                // =========================================

                let video =
                    null;


                if (
                    videoInput &&
                    videoInput.files &&
                    videoInput.files.length >
                        0
                ) {

                    const selectedVideo =
                        videoInput.files[0];


                    console.log(
                        "Video selected:",
                        selectedVideo.name,
                        selectedVideo.size,
                        selectedVideo.type
                    );


                    // =====================================
                    // CHECK VIDEO TYPE
                    // =====================================

                    if (
                        !selectedVideo.type ||
                        !selectedVideo.type.startsWith(
                            "video/"
                        )
                    ) {

                        throw new Error(
                            "Selected file is not a valid video."
                        );

                    }


                    // =====================================
                    // CHECK VIDEO SIZE
                    // =====================================

                    if (
                        selectedVideo.size >
                        MAX_VIDEO_SIZE
                    ) {

                        throw new Error(
                            "Video is larger than 20 MB."
                        );

                    }


                    showStatus(
                        "<strong>🎥 Processing video...</strong>",
                        "info"
                    );


                    video =
                        await readVideo(
                            selectedVideo
                        );


                    console.log(
                        "Video processed successfully."
                    );

                }



                // =========================================
                // CREATE REPORT OBJECT
                // =========================================

                const report = {

                    action:
                        "saveReport",

                    dateTime:
                        formData.dateTime,

                    location:
                        formData.location
                            .substring(
                                0,
                                MAX_LOCATION_LENGTH
                            ),

                    department:
                        formData.department,

                    hazardCategory:
                        formData.hazardCategory,

                    whatHappened:
                        formData.whatHappened
                            .substring(
                                0,
                                MAX_DESCRIPTION_LENGTH
                            ),

                    reporterName:
                        formData.reporterName
                            .substring(
                                0,
                                MAX_REPORTER_NAME_LENGTH
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
                    "REPORT READY:",
                    {

                        action:
                            report.action,

                        dateTime:
                            report.dateTime,

                        location:
                            report.location,

                        department:
                            report.department,

                        hazardCategory:
                            report.hazardCategory,

                        photoCount:
                            report.photos.length,

                        hasVideo:
                            !!report.video

                    }
                );



                // =========================================
                // SEND REPORT
                // =========================================

                showStatus(
                    "<strong>☁️ Sending report to BKH ESH system...</strong>",
                    "info"
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
                                    report
                                )

                        }
                    );


                console.log(
                    "SERVER STATUS:",
                    response.status
                );


                // =========================================
                // READ RESPONSE
                // =========================================

                const responseText =
                    await response.text();


                console.log(
                    "SERVER RESPONSE:",
                    responseText
                );


                if (
                    !responseText
                ) {

                    throw new Error(
                        "The server returned an empty response."
                    );

                }


                // =========================================
                // PARSE JSON
                // =========================================

                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }


                catch (
                    jsonError
                ) {

                    console.error(
                        "JSON PARSE ERROR:",
                        jsonError
                    );


                    throw new Error(
                        "Server did not return a valid response. Please try again."
                    );

                }



                // =========================================
                // CHECK SERVER RESULT
                // =========================================

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



                // =========================================
                // REPORT NUMBER
                // =========================================

                const assignedReportNumber =
                    result.reportNumber ||
                    "Assigned by system";


                console.log(
                    "SERVER ASSIGNED REPORT NUMBER:",
                    assignedReportNumber
                );


                // =================================================
                // KEEP THESE LOGS FOR ADMIN/DEVELOPER DEBUGGING
                // They are NOT shown to the worker.
                // =================================================

                console.log(
                    "SERVER SAVED PHOTOS:",
                    result.photos
                );


                console.log(
                    "SERVER SAVED VIDEO:",
                    result.video
                );



                // =========================================
                // SUCCESS
                // =========================================
                //
                // IMPORTANT:
                // The worker will NOT see photo count
                // or video status here.
                //
                // Photos and video are still uploaded.
                //
                // =========================================

                showStatus(

                    "<strong>✅ Safety report submitted successfully!</strong>" +

                    "<br><br>" +

                    "Report No: <strong>" +
                    assignedReportNumber +
                    "</strong>" +

                    "<br><br>" +

                    "Your report has been recorded and sent to the BKH ESH Department.",

                    "success"

                );



                console.log(
                    "=========================================="
                );

                console.log(
                    "REPORT SUBMITTED SUCCESSFULLY"
                );

                console.log(
                    "REPORT NUMBER:",
                    assignedReportNumber
                );

                console.log(
                    "=========================================="
                );



                // =========================================
                // RESET FORM
                // =========================================

                form.reset();


                // =========================================
                // CLEAR PREVIEWS
                // =========================================

                clearFilePreviews();


                // =========================================
                // RESTORE MALAYSIA DATE/TIME
                // =========================================

                setMalaysiaDateTime();

            }


            catch (
                error
            ) {

                console.error(
                    "=========================================="
                );

                console.error(
                    "SUBMISSION ERROR:",
                    error
                );

                console.error(
                    "=========================================="
                );


                showStatus(

                    "<strong>❌ Unable to submit safety report.</strong>" +

                    "<br><br>" +

                    (
                        error &&
                        error.message
                            ? error.message
                            : "An unexpected error occurred."
                    ) +

                    "<br><br>" +

                    "Your entered information has NOT been cleared. " +
                    "Please correct the issue and try again.",

                    "error"

                );

            }


            finally {

                // =========================================
                // RE-ENABLE BUTTON
                // =========================================

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "SUBMIT SAFETY REPORT";

                }

            }

        }
    );

}



// =====================================================
// CORRECTIVE ACTION PHOTO UPLOAD
// =====================================================
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
        String(
            reportNumber
        ).trim() === ""
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
        !file.type.startsWith(
            "image/"
        )
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
    // CREATE PAYLOAD
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
    // VALIDATE PAYLOAD
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
                payload.photo.base64.length

        }
    );



    // =================================================
    // SEND TO GOOGLE APPS SCRIPT
    // =================================================

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


    if (!responseText) {

        throw new Error(
            "Server returned an empty response."
        );

    }



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


    catch (
        error
    ) {

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
// Dashboard can call either:
//
// uploadCorrectiveActionPhoto()
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


    catch (
        error
    ) {

        console.error(
            "CORRECTIVE PHOTO UPLOAD ERROR:",
            error
        );


        throw error;

    }

}



// =====================================================
// SYSTEM READY
// =====================================================

console.log(
    "BKH ESH SAFETY REPORTING PORTAL READY"
);

console.log(
    "Approved departments:",
    VALID_DEPARTMENTS
);

console.log(
    "Approved hazard categories:",
    VALID_HAZARD_CATEGORIES
);

console.log(
    "Corrective action photo uploader ready."
);
