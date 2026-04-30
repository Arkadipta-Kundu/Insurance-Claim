package com.project.insurancebackend;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageSteganography {

    private static final int BITS_PER_CHANNEL = 2; // Use 2 LSBs per channel

    // Hide a secret image inside cover image
    public static void hideImage(String coverPath, String[] secretPaths, String outputPath) throws IOException {
        if (secretPaths.length == 0) {
            throw new IllegalArgumentException("At least one secret image is required.");
        }

        BufferedImage cover = ImageIO.read(new File(coverPath));
        int coverWidth = cover.getWidth();
        int coverHeight = cover.getHeight();

        // Read secret images
        BufferedImage[] secrets = new BufferedImage[secretPaths.length];
        int totalSecretPixels = 0;
        for (int i = 0; i < secretPaths.length; i++) {
            secrets[i] = ImageIO.read(new File(secretPaths[i]));
            totalSecretPixels += secrets[i].getWidth() * secrets[i].getHeight();
        }

        // Calculate required bits
        int totalSecretBits = secretPaths.length * 64 + (totalSecretPixels * 24); // 64 bits for metadata per image +
                                                                                  // pixel bits
        int availableBits = coverWidth * coverHeight * BITS_PER_CHANNEL * 3;

        if (availableBits < totalSecretBits) {
            throw new IllegalArgumentException("Cover image is too small to hide the secret images.");
        }

        BufferedImage stego = new BufferedImage(coverWidth, coverHeight, BufferedImage.TYPE_INT_RGB);

        // Create bit stream for all images
        StringBuilder bitStream = new StringBuilder();

        // Append each secret image's metadata & pixels
        for (int i = 0; i < secretPaths.length; i++) {
            int w = secrets[i].getWidth();
            int h = secrets[i].getHeight();

            bitStream.append(toBinary(w, 32)); // width
            bitStream.append(toBinary(h, 32)); // height

            int[] pixels = new int[w * h];
            secrets[i].getRGB(0, 0, w, h, pixels, 0, w);
            for (int pixel : pixels) {
                int r = (pixel >> 16) & 0xFF;
                int g = (pixel >> 8) & 0xFF;
                int b = pixel & 0xFF;
                bitStream.append(toBinary(r, 8));
                bitStream.append(toBinary(g, 8));
                bitStream.append(toBinary(b, 8));
            }
        }

        int bitIndex = 0;
        for (int y = 0; y < coverHeight; y++) {
            for (int x = 0; x < coverWidth; x++) {
                int coverPixel = cover.getRGB(x, y);
                int r = (coverPixel >> 16) & 0xFF;
                int g = (coverPixel >> 8) & 0xFF;
                int b = coverPixel & 0xFF;

                if (bitIndex < bitStream.length())
                    r = setLSBs(r, bitStream, bitIndex, BITS_PER_CHANNEL);
                bitIndex += BITS_PER_CHANNEL;
                if (bitIndex < bitStream.length())
                    g = setLSBs(g, bitStream, bitIndex, BITS_PER_CHANNEL);
                bitIndex += BITS_PER_CHANNEL;
                if (bitIndex < bitStream.length())
                    b = setLSBs(b, bitStream, bitIndex, BITS_PER_CHANNEL);
                bitIndex += BITS_PER_CHANNEL;

                int newPixel = (r << 16) | (g << 8) | b;
                stego.setRGB(x, y, newPixel);
            }
        }

        ImageIO.write(stego, "png", new File(outputPath));
        System.out.println("✅ Secret image hidden in " + outputPath);
    }

    // Extract secret images
    public static void extractImage(String stegoPath, String outputDir) throws IOException {
        BufferedImage stego = ImageIO.read(new File(stegoPath));
        int width = stego.getWidth();
        int height = stego.getHeight();

        StringBuilder bitStream = new StringBuilder();

        // Extract bits
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int pixel = stego.getRGB(x, y);
                int r = (pixel >> 16) & 0xFF;
                int g = (pixel >> 8) & 0xFF;
                int b = pixel & 0xFF;

                bitStream.append(getLSBs(r, BITS_PER_CHANNEL));
                bitStream.append(getLSBs(g, BITS_PER_CHANNEL));
                bitStream.append(getLSBs(b, BITS_PER_CHANNEL));
            }
        }

        int index = 0;
        int imageCount = 0;
        while (index + 64 <= bitStream.length()) {
            int w = Integer.parseInt(bitStream.substring(index, index + 32), 2);
            int h = Integer.parseInt(bitStream.substring(index + 32, index + 64), 2);
            index += 64;

            int totalBitsNeeded = w * h * 24;
            if (index + totalBitsNeeded > bitStream.length()) {
                break;
            }

            BufferedImage secret = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);

            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int r = Integer.parseInt(bitStream.substring(index, index + 8), 2);
                    int g = Integer.parseInt(bitStream.substring(index + 8, index + 16), 2);
                    int b = Integer.parseInt(bitStream.substring(index + 16, index + 24), 2);
                    int pixel = (r << 16) | (g << 8) | b;
                    secret.setRGB(x, y, pixel);
                    index += 24;
                }
            }

            File outFile = new File(outputDir + "/extracted" + (imageCount + 1) + ".png");
            ImageIO.write(secret, "png", outFile);
            System.out.println("✅ Extracted image " + (imageCount + 1) + " to " + outFile.getAbsolutePath());
            imageCount++;
        }
    }

    private static String toBinary(int value, int bits) {
        String bin = Integer.toBinaryString(value);
        while (bin.length() < bits)
            bin = "0" + bin;
        return bin;
    }

    private static int setLSBs(int value, StringBuilder bits, int bitIndex, int numBits) {
        int mask = (1 << numBits) - 1;
        int newBits = 0;
        for (int i = 0; i < numBits && (bitIndex + i) < bits.length(); i++) {
            newBits = (newBits << 1) | (bits.charAt(bitIndex + i) - '0');
        }
        // Ensure we don't shift beyond numBits
        if (newBits > mask) {
            newBits = newBits >> (Integer.toBinaryString(newBits).length() - numBits);
        }
        return (value & ~mask) | newBits;
    }

    private static String getLSBs(int value, int numBits) {
        StringBuilder sb = new StringBuilder();
        for (int i = numBits - 1; i >= 0; i--) {
            sb.append((value >> i) & 1);
        }
        return sb.toString();
    }

    public static void main(String[] args) throws IOException {
        String coverImage = "cover.png";
        String[] secretImages = { "secret1.png" };
        String stegoImage = "stego.png";
        String outputDir = "output";

        new File(outputDir).mkdirs();

        hideImage(coverImage, secretImages, stegoImage);
        extractImage(stegoImage, outputDir);
    }
}