FROM python:3-alpine

RUN apk add --no-cache nodejs npm

RUN apk add --no-cache \
    build-base cairo-dev cairo cairo-tools \
    # pillow dependencies
    jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev

WORKDIR /app
COPY . .
RUN npm ci
RUN pip install --no-cache-dir -r requirements.txt
RUN node index.js
EXPOSE 8000
RUN ls


CMD [ "mkdocs", "serve" , "--clean"]
