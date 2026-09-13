package com.wishlite.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PublishService {

    private final RestClient restClient = RestClient.create();

    public Map<String, String> publishHtml(String filename, byte[] html) {
        String name = (filename == null || filename.isBlank() ? "wish" : filename)
                .replaceAll("[^a-zA-Z0-9._-]", "-");
        if (!name.endsWith(".html")) {
            name = name + ".html";
        }
        Exception last = null;
        try {
            String url = uploadCatbox(name, html);
            return result(url, "catbox");
        } catch (Exception ex) {
            last = ex;
        }
        try {
            String url = uploadZeroZero(name, html);
            return result(url, "0x0");
        } catch (Exception ex) {
            last = ex;
        }
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Could not publish a public link. Download the HTML file instead. "
                        + (last == null ? "" : last.getMessage()));
    }

    private Map<String, String> result(String url, String host) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("publicUrl", url.trim());
        map.put("host", host);
        return map;
    }

    private String uploadCatbox(String filename, byte[] html) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("reqtype", "fileupload");
        builder.part("fileToUpload", new NamedBytes(filename, html))
                .contentType(MediaType.TEXT_HTML);
        String body = restClient.post()
                .uri("https://catbox.moe/user/api.php")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(builder.build())
                .retrieve()
                .body(String.class);
        if (body == null || !body.startsWith("http")) {
            throw new IllegalStateException("Unexpected catbox response");
        }
        return body;
    }

    private String uploadZeroZero(String filename, byte[] html) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", new NamedBytes(filename, html))
                .contentType(MediaType.TEXT_HTML);
        String body = restClient.post()
                .uri("https://0x0.st")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(builder.build())
                .retrieve()
                .body(String.class);
        if (body == null || !body.startsWith("http")) {
            throw new IllegalStateException("Unexpected 0x0 response");
        }
        return body;
    }

    private static final class NamedBytes extends ByteArrayResource {
        private final String filename;

        private NamedBytes(String filename, byte[] bytes) {
            super(bytes);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }

    public static byte[] utf8(String html) {
        return html.getBytes(StandardCharsets.UTF_8);
    }
}
