package com.pfm.pfmbackend.batch.writer;

import com.pfm.pfmbackend.batch.dto.TransactionCsvDTO;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder;
import org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor;
import org.springframework.batch.item.file.transform.DelimitedLineAggregator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

@Configuration
public class WriterConfig {
    @Bean
    public FlatFileItemWriter<TransactionCsvDTO> transactionItemWriter() {
        var extractor = new org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor<TransactionCsvDTO>();
        extractor.setNames(new String[]{"bhLib", "dco", "mon", "sen", "iban", "categorie"});

        var aggregator = new org.springframework.batch.item.file.transform.DelimitedLineAggregator<TransactionCsvDTO>();
        aggregator.setDelimiter(",");
        aggregator.setFieldExtractor(extractor);

        return new org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder<TransactionCsvDTO>()
                .name("transactionItemWriter")
                .resource(new org.springframework.core.io.FileSystemResource("D:/PFM/transactions_categorized.csv"))
                .lineAggregator(aggregator)
                .headerCallback(writer -> writer.write("bhLib,dco,mon,sen,iban,categorie"))
                .build();
    }
}
