package com.project.insurancebackend;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageFragmentation {

    // Split image into 4 equal parts
    public static void splitImage(String inputPath, String outputDir) throws IOException {
        BufferedImage image = ImageIO.read(new File(inputPath));
        int width = image.getWidth();
        int height = image.getHeight();

        int partWidth = width / 2;
        int partHeight = height / 2;

        BufferedImage part1 = image.getSubimage(0, 0, partWidth, partHeight); // Top-Left
        BufferedImage part2 = image.getSubimage(partWidth, 0, partWidth, partHeight); // Top-Right
        BufferedImage part3 = image.getSubimage(0, partHeight, partWidth, partHeight); // Bottom-Left
        BufferedImage part4 = image.getSubimage(partWidth, partHeight, partWidth, partHeight); // Bottom-Right
        // Create fragments directory
        String fragmentDir = outputDir;
        new File(fragmentDir).mkdirs();

        ImageIO.write(part1, "png", new File(fragmentDir, "part1.png"));
        ImageIO.write(part2, "png", new File(fragmentDir, "part2.png"));
        ImageIO.write(part3, "png", new File(fragmentDir, "part3.png"));
        ImageIO.write(part4, "png", new File(fragmentDir, "part4.png"));

        System.out.println("✅ Image split into 4 parts successfully.");
    }

    public static void main(String[] args) throws IOException {
        String inputImage = "original.png";
        String outputDir = "fragments";
        new File(outputDir).mkdirs();

        splitImage(inputImage, outputDir);
    }
}
