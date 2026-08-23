# Metadata Tool

`/metadata` is a free file metadata inspector and sanitizer for images, video, and audio on nimaaksoy.com. It is based on the same practical model as Verinio: use `ffprobe` for container/stream metadata, WebAssembly ExifTool for embedded tags and provenance, and `ffmpeg` plus WebAssembly ExifTool for clean downloads.

## What Metadata Means

Metadata is data stored inside or around a file that describes the file itself. It can include harmless technical fields, useful creative fields, and private or traceable fields.

Common examples:

- File/container data: filename, size, MIME type, codec, duration, bitrate, dimensions, stream count.
- Image data: EXIF camera make/model, orientation, color profile, GPS, timestamps, PNG chunks, XMP/IPTC.
- Video data: QuickTime atoms, creation dates, device tags, GPS, chapters, stream dispositions, encoder data.
- Audio/music data: ID3, title, artist, album, lyrics, composer, cover art, MusicBrainz/ISRC/private IDs.
- AI/provenance data: C2PA, JUMBF, CBOR, generator name, assertion hashes, signatures, watermarks, source type.

The inspector must not assume a source. Metadata may come from OpenAI, Grok, Suno, YouTube downloads, cameras, editors, DAWs, phones, design tools, or any other media pipeline.

## Inspection Flow

When a user selects a file:

1. The browser sends the file to `POST /api/metadata`.
2. The server writes the upload to a temporary file.
3. `ffprobe` reads format, stream, chapter, program, and private stream data.
4. WebAssembly ExifTool runs `-json -g1 -a -ee` to read grouped embedded metadata, including duplicate tags and embedded stream metadata.
5. The server computes SHA-256 and MD5.
6. The temporary file is deleted after processing.
7. The UI renders every returned group recursively.

The file is not stored permanently. It exists only as a temporary processing file for the request.

## Display Contract

The UI should display all returned metadata, not only selected highlights.

Required display sections:

- `File`: filename, size, hashes.
- `Container`: raw `ffprobe.format`.
- `Stream N`: every `ffprobe.streams[]` object.
- `Chapter N`: every `ffprobe.chapters[]` object.
- `Program N`: every `ffprobe.programs[]` object.
- Every `exiftool` group except `SourceFile`, including:
  - `ExifTool`
  - `System`
  - `File`
  - `PNG`, `EXIF`, `XMP`, `IPTC`, `ICC_Profile`, `QuickTime`, `ID3`, etc.
  - `JUMBF`, `Jpeg2000`, `CBOR`, and C2PA/provenance groups.
  - Any future or unknown group.

Nested objects and arrays must be rendered as visible table rows using their full field path. For example, a C2PA/CBOR field such as `ClaimGeneratorInfo.Name` should become a visible row, not a collapsed object that users can miss. Do not flatten in a way that drops nested values. Do not maintain a hard-coded allowlist of metadata groups.

## Sanitization Flow

`POST /api/metadata/sanitize?mode=strip`

- Images: copy or re-encode the file and use WebAssembly ExifTool to remove embedded metadata.
- Video: remux with `ffmpeg`, remove metadata and chapters, copy streams when possible, then use WebAssembly ExifTool for a final metadata strip.
- Audio: remux with `ffmpeg`, remove metadata, then re-add only safe descriptive music tags.

`POST /api/metadata/sanitize?mode=compress`

- Images: re-encode to JPEG and strip metadata.
- Video: re-encode to MP4/H.265 + AAC and strip metadata/chapters.
- Audio: re-encode to M4A/AAC and preserve only safe descriptive music tags.

Unsupported file types should return a clear unsupported-file error. Compression is only meaningful for supported image, video, and audio formats.

## Audio Tags Kept

Audio sanitization may keep descriptive, non-private music tags:

- title
- artist
- album
- album artist
- composer
- performer
- track/disc numbers
- genre
- date/year
- grouping
- compilation
- publisher/copyright
- lyricist/conductor
- lyrics
- language
- BPM/tempo
- description

Private or traceable IDs should not be preserved unless they are required for playback.

## Analytics

The top stats on `/metadata` use PostHog aggregates:

- Total page visits: `$pageview` where `$pathname = /metadata`.
- Files inspected: `metadata_upload`.
- Files sanitized: `metadata_sanitize`.

The client emits:

- `metadata_upload` after a successful metadata inspection.
- `metadata_sanitize` after a successful sanitize or sanitize+compress download.

Only aggregate counts are displayed. Do not store uploaded files or raw metadata reports in analytics.

## Verification Checklist

Before pushing metadata changes:

1. Run focused lint for metadata files.
2. Run `npm run build`.
3. Test inspection with:
   - PNG with C2PA/JUMBF/CBOR or PNG chunk metadata.
   - JPEG with EXIF/GPS.
   - MP4/MOV with QuickTime/container tags.
   - MP3/M4A with ID3/music tags and lyrics if available.
   - Unsupported text/binary file.
4. Confirm all expected `exiftool` groups render on the page.
5. Confirm sanitize removes private/provenance tags.
6. Confirm sanitize+compress returns a playable/viewable file where compression is supported.
7. Confirm temporary files are removed after each request.

## Future Development Notes

- Keep the renderer source-agnostic. Do not add OpenAI-only, Grok-only, Suno-only, or YouTube-only logic unless it is a small label on top of raw metadata.
- Prefer displaying raw groups completely, then optionally add friendly summaries above them.
- If adding more client-side processing later, do not reduce metadata coverage. Browser APIs alone cannot match ExifTool/ffprobe coverage for many media formats.
- If Vercel function limits become an issue, move processing to a dedicated worker, but keep the same API response contract.
