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
// GENERATE REPORT NUMBER
// =====================================================

function generateReportNumber() {

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


    let counter =
        Number(
            localStorage.getItem(
                "nearMissCounter"
            )
        ) || 0;


    counter++;


    localStorage.setItem(
        "nearMissCounter",
        counter
    );


    return (
        "NM-" +
        year +
        month +
        day +
        "-" +
        String(counter).padStart(
            4,
            "0"
        )
    );

}


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


                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );


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

                        data:
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

            // =============================================
            // STOP NORMAL HTML FORM SUBMISSION
            // =============================================

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();


            console.log(
                "SUBMIT EVENT DETECTED"
            );


            // =============================================
            // BUTTON
            // =============================================

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


            // =============================================
            // STATUS MESSAGE
            // =============================================

            if (successMessage) {

                successMessage.style.display =
                    "block";

                successMessage.innerHTML =
                    "<strong>⏳ Preparing report...</strong>";

            }


            try {

                // =========================================
                // GENERATE REPORT NUMBER
                // =========================================

                const reportNumber =
                    generateReportNumber();


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

                        photoData:
                            compressed.data,

                        photoName:
                            compressed.name,

                        photoType:
                            compressed.type

                    });

                }


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

                }


                // =========================================
                // CREATE REPORT OBJECT
                // =========================================

                const report = {

                    reportNumber:
                        reportNumber,

                    dateTime:
                        getValue(
                            "dateTime"
                        ),

                    location:
                        getValue(
                            "location"
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
                    "REPORT READY:",
                    report
                );


                // =========================================
                // SEND TO GOOGLE APPS SCRIPT
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


                // =========================================
                // CHECK SERVER SUCCESS
                // =========================================

                if (
                    !result ||
                    result.success !== true
                ) {

                    throw new Error(
                        result.error ||
                        "Report was not accepted by the server."
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                if (successMessage) {

                    successMessage.innerHTML =
                        "<strong>✅ Report submitted successfully!</strong>" +
                        "<br><br>" +
                        "Report No: <strong>" +
                        reportNumber +
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
                    "REPORT SUBMITTED SUCCESSFULLY"
                );


                // =========================================
                // CLEAR FORM ONLY AFTER SUCCESS
                // =========================================

                form.reset();


                // =========================================
                // RESET PHOTO INFORMATION
                // =========================================

                if (photoCount) {

                    photoCount.textContent =
                        "No photos selected";

                }


                // =========================================
                // RESET VIDEO INFORMATION
                // =========================================

                if (videoInfo) {

                    videoInfo.textContent =
                        "No video selected";

                }


                // =========================================
                // NEW DATE/TIME
                // =========================================

                setMalaysiaDateTime();

            }


            // =============================================
            // ERROR
            // =============================================

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


            // =============================================
            // FINALLY
            // =============================================

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
// END OF SCRIPT
// =====================================================

console.log(
    "NEAR MISS REPORTING SYSTEM READY"
);
