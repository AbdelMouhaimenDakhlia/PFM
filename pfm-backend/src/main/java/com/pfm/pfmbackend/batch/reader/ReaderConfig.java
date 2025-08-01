package com.pfm.pfmbackend.batch.reader;

import com.pfm.pfmbackend.batch.dto.TransactionCsvDTO;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.beans.factory.annotation.Value; // ✅ ici l'import correct

@Configuration
public class ReaderConfig {

    @Bean
    @StepScope
    public FlatFileItemReader<TransactionCsvDTO> transactionItemReader(
            @Value("#{jobParameters['filePath']}") String filePath) {

        return new FlatFileItemReaderBuilder<TransactionCsvDTO>()
                .name("transactionItemReader")
                .resource(new FileSystemResource(filePath))
                .delimited()
                .names("bhLib","dco", "mon", "sen", "iban","produit")
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>() {{
                    setTargetType(TransactionCsvDTO.class);
                }})
                .linesToSkip(1)
                .build();
    }
}
