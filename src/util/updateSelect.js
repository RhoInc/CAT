export default function updateSelect(select, data) {
    select
        .selectAll('option')
            .data(data)
            .enter()
        .append('option')
        .text(d => d.label);
}
